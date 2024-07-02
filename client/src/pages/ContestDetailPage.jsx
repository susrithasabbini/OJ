import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { CheckCircle, Star } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { url } from "../config";
import { useGlobalContext } from "../context";

const ContestDetailPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const { user } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/contests/${contestId}`,
          {
            withCredentials: true,
          }
        );
        setContest(response.data.contest);
      } catch (error) {
        toast.error("Failed to fetch contest details");
        console.error("Failed to fetch contest details:", error);
      }
    };

    const fetchContestLeaderboard = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/contests/${contestId}/leaderboard`,
          {
            withCredentials: true,
          }
        );
        setLeaderboard(response.data.leaderboardWithDetails);
      } catch (error) {
        toast.error("Failed to fetch leaderboard");
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    fetchContest();
    fetchContestLeaderboard();
  }, [contestId]);

  const handleProblemClick = (slug) => {
    if (contest.status === "Ended") {
      toast.warning("Contest already ended!", { position: "top-center" });
      return;
    }
    navigate(`/contests/${contestId}/problems/${slug}/description`);
  };

  if (!contest) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900 mb-2">
            {contest?.title}
          </h1>
          <p className="text-gray-700 mb-4">{contest?.description}</p>
        </div>
      </div>
      <div className="space-y-6 mb-8">
        {contest.problems.map((problem) => (
          <div
            key={problem?._id}
            onClick={() => handleProblemClick(problem.slug)}
            className={`p-4 ${
              problem.solvedBy.includes(user.userId) && "bg-green-100"
            } shadow-md rounded-lg flex flex-col md:flex-row md:items-center justify-between cursor-pointer`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h2 className="text-lg font-semibold">{problem?.title}</h2>
              <Chip
                color={`${
                  problem.difficulty === "Easy"
                    ? "success"
                    : problem.difficulty === "Medium"
                    ? "warning"
                    : problem.difficulty === "Hard"
                    ? "danger"
                    : "default"
                }`}
                variant="flat"
                className="whitespace-nowrap"
              >
                {problem?.difficulty}
              </Chip>
              <p className="text-gray-700">Points: {problem?.points}</p>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <CheckCircle size={20} className="text-blue-500" />
              <p className="text-gray-600">
                {problem.solvedBy?.length || 0} Solvers
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
      <div className="overflow-x-auto">
        <Table
          aria-label="Leaderboard"
          className="w-full bg-white rounded-lg shadow-md"
        >
          <TableHeader>
            <TableColumn>Rank</TableColumn>
            <TableColumn>Username</TableColumn>
            <TableColumn>Points</TableColumn>
          </TableHeader>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow key={user.userId}>
                <TableCell>
                  {index === 0 ? (
                    <Star size={20} className="text-yellow-500" />
                  ) : index === 1 ? (
                    <Star size={20} className="text-gray-400" />
                  ) : index === 2 ? (
                    <Star size={20} className="text-yellow-700" />
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell>{user.username || "Unknown"}</TableCell>
                <TableCell>{user.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContestDetailPage;
