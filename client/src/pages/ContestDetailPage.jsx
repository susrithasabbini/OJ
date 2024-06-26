import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { CheckCircle, Star } from "lucide-react";

const difficultyColors = {
  Easy: "text-green-600",
  Medium: "text-yellow-600",
  Hard: "text-red-600",
};

const ContestDetailPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch contest details, problems, and leaderboard using contestId
    // Here we're using mock data for demonstration
    const fetchedContest = {
      id: contestId,
      title: "Monthly Coding Challenge",
      description:
        "Participate in our monthly coding challenge to win exciting prizes!",
      startDate: "2024-07-01",
      endDate: "2024-07-15",
    };

    const fetchedProblems = [
      { id: 1, title: "Two Sum", difficulty: "Easy", solvers: 120 },
      {
        id: 2,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        solvers: 85,
      },
      {
        id: 3,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        solvers: 45,
      },
    ];

    const fetchedLeaderboard = [
      { id: 1, username: "Alice", points: 150 },
      { id: 2, username: "Bob", points: 140 },
      { id: 3, username: "Charlie", points: 130 },
    ];

    setContest(fetchedContest);
    setProblems(fetchedProblems);
    setLeaderboard(fetchedLeaderboard);
  }, [contestId]);

  if (!contest) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 h-fit w-full">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">{contest.title}</h1>
      <p className="text-gray-700 mb-4">{contest.description}</p>
      <div className="space-y-4 mb-8">
        {problems.map((problem) => (
          <Card key={problem.id} className="p-4 bg-white shadow-md rounded-lg">
            <div className="flex flex-row justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{problem.title}</h2>
                <p
                  className={`text-gray-600 ${
                    difficultyColors[problem.difficulty]
                  }`}
                >
                  Difficulty: {problem.difficulty}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-blue-500" />
                <p className="text-gray-600">{problem.solvers} Solvers</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-900">Leaderboard</h2>
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
            <TableRow key={user.id}>
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
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContestDetailPage;
