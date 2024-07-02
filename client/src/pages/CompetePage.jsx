import { useEffect, useState } from "react";
import { Card, Button, Tooltip } from "@nextui-org/react";
import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../config";
import { toast } from "sonner";
import { useGlobalContext } from "../context";

const CompetePage = () => {
  const [contests, setContests] = useState([]);
  const navigate = useNavigate();
  const { user } = useGlobalContext();

  console.log({ contests });

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/contests/getRecentContests`,
          {
            withCredentials: true,
          }
        );
        setContests(response.data.contests);
      } catch (error) {
        toast.error("Failed to fetch contests");
        console.error("Failed to fetch contests:", error);
      }
    };
    fetchContests();
  }, []);

  const handleRegister = async (contestId) => {
    if (!user) {
      toast.warning("Please Login!");
      return;
    }
    try {
      await axios.post(
        `${url}/api/v1/contests/${contestId}/register`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("Successfully registered for the contest");
      setContests((prevContests) =>
        prevContests.map((contest) =>
          contest._id === contestId
            ? {
                ...contest,
                participants: [...contest.participants, user?.userId],
              }
            : contest
        )
      );
    } catch (error) {
      toast.error("Failed to register for the contest");
      console.error("Failed to register for the contest:", error);
    }
  };

  const handleJoin = (contestId) => {
    if (!user) {
      toast.warning("Please Login!");
      return;
    }
    navigate(`/compete/${contestId}`);
  };

  return (
    <div className="p-6 h-fit w-full">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Compete</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => {
          const isRegistered = contest.participants.includes(user?.userId);
          return (
            <Card
              key={contest._id}
              className="p-6 bg-white shadow-lg rounded-lg"
            >
              <h2 className="text-2xl font-bold mb-2">{contest.title}</h2>
              <p className="text-gray-600 mb-4">{contest.description}</p>
              <div className="flex items-center mb-4">
                <Calendar size={20} className="mr-2 text-blue-500" />
                <span>
                  {contest.startDate.split("T")[0]} -{" "}
                  {contest.endDate.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center mb-4">
                <Clock size={20} className="mr-2 text-blue-500" />
                <span>{contest.status}</span>
              </div>
              {contest.status === "Ongoing" && isRegistered && (
                <Button
                  color="primary"
                  className="w-full"
                  onClick={() => handleJoin(contest._id)}
                >
                  Join Now
                </Button>
              )}
              {contest.isPublic && !isRegistered && (
                <Button
                  color="primary"
                  className="w-full"
                  onClick={() => handleRegister(contest._id)}
                >
                  Register
                </Button>
              )}
              {contest.status === "Upcoming" &&
                contest.isPublic &&
                isRegistered && (
                  <Tooltip content="Upcoming contest.">
                    <Button color="primary" className="w-full" disabled>
                      Registered
                    </Button>
                  </Tooltip>
                )}
              {contest.status === "Upcoming" &&
                !contest.isPublic &&
                !isRegistered && (
                  <Tooltip content="Upcoming contest. Registration will open soon.">
                    <Button color="primary" className="w-full" disabled>
                      Register
                    </Button>
                  </Tooltip>
                )}
              {contest.status === "Ended" && isRegistered && (
                <Button
                  color="primary"
                  className="w-full"
                  onClick={() => handleJoin(contest._id)}
                >
                  View Contest
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CompetePage;
