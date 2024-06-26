import { useState } from "react";
import { Card, Button, Tooltip } from "@nextui-org/react";
import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompetePage = () => {
  const [contests] = useState([
    {
      id: 1,
      title: "Monthly Coding Challenge",
      description:
        "Participate in our monthly coding challenge to win exciting prizes!",
      startDate: "2024-07-01",
      endDate: "2024-07-15",
      status: "Ongoing",
    },
    {
      id: 2,
      title: "Summer Hackathon",
      description:
        "Join the summer hackathon to build amazing projects with peers.",
      startDate: "2024-08-01",
      endDate: "2024-08-10",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Winter Coding Marathon",
      description:
        "Compete in the winter coding marathon and showcase your coding skills.",
      startDate: "2024-12-01",
      endDate: "2024-12-15",
      status: "Upcoming",
    },
  ]);

  const navigate = useNavigate();

  const handleJoin = (contestId) => {
    navigate(`/compete/${contestId}`);
  };

  return (
    <div className="p-6 h-fit w-full">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Compete</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <Card key={contest.id} className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-2">{contest.title}</h2>
            <p className="text-gray-600 mb-4">{contest.description}</p>
            <div className="flex items-center mb-4">
              <Calendar size={20} className="mr-2 text-blue-500" />
              <span>
                {contest.startDate} - {contest.endDate}
              </span>
            </div>
            <div className="flex items-center mb-4">
              <Clock size={20} className="mr-2 text-blue-500" />
              <span>{contest.status}</span>
            </div>
            {contest.status === "Ongoing" ? (
              <Button
                color="primary"
                className="w-full"
                onClick={() => handleJoin(contest.id)}
              >
                Join Now
              </Button>
            ) : (
              <Tooltip content="Upcoming contest. Registration will open soon.">
                <Button color="primary" className="w-full" disabled>
                  Register
                </Button>
              </Tooltip>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompetePage;
