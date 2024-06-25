import { useState } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { Crown } from "lucide-react";
import { useGlobalContext } from "../context";

const LeaderboardPage = () => {
  const { user } = useGlobalContext();

  console.log(user.username);
  const [users] = useState([
    {
      id: 1,
      username: "susritha",
      email: "sabbinisusritha@gmail.com",
      points: 1500,
    },
    { id: 2, username: "Jane Smith", points: 1400 },
    { id: 3, username: "Sam Johnson", points: 1350 },
    { id: 4, username: "Alice Brown", points: 1300 },
    { id: 5, username: "Charlie Wilson", points: 1250 },
    { id: 6, username: "Emily Davis", points: 1200 },
    { id: 7, username: "Daniel Moore", points: 1150 },
    { id: 8, username: "Sophia Taylor", points: 1100 },
    { id: 9, username: "Michael Anderson", points: 1050 },
    { id: 10, username: "Laura Thompson", points: 1000 },
    { id: 11, username: "Chris Lee", points: 950 },
    { id: 12, username: "Grace Harris", points: 900 },
    { id: 13, username: "John Doe", points: 800 },
  ]);

  return (
    <div className="p-6 h-fit w-full">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Leaderboard</h1>

      <Card className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-blue-300 text-white shadow-lg flex items-center">
        <div className="flex flex-col items-center justify-center border-4 w-fit p-6 border-yellow-500 rounded-3xl">
          <Crown size={48} className="mb-4" color="#eab308" />
          <h2 className="text-2xl font-bold mb-2">{users[0].username}</h2>
          <p className="text-lg mb-4">{users[0].email}</p>
        </div>
      </Card>

      <div className="overflow-x-auto max-h-96 thin-scrollbar">
        <Table className="min-w-full bg-white rounded-lg shadow-lg">
          <TableHeader className="bg-blue-500 text-white">
            <TableColumn className="text-left p-4">Rank</TableColumn>
            <TableColumn className="text-left p-4">Name</TableColumn>
            <TableColumn className="text-left p-4">Points</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((u, index) => (
              <TableRow
                key={u.id}
                className={`${
                  u.username === user.username
                    ? "bg-yellow-100/60"
                    : index % 2 === 0
                    ? "bg-gray-100"
                    : ""
                } hover:bg-blue-100 transition-all`}
              >
                <TableCell className="py-2 px-4 border-b border-gray-200">
                  {index + 1 === 1 ? (
                    <Tooltip content="Top Rank">
                      <Crown size={24} color="#FFD700" />
                    </Tooltip>
                  ) : index + 1 === 2 ? (
                    <Tooltip content="Second Rank">
                      <Crown size={24} color="#C0C0C0" />
                    </Tooltip>
                  ) : index + 1 === 3 ? (
                    <Tooltip content="Third Rank">
                      <Crown size={24} color="#CD7F32" />
                    </Tooltip>
                  ) : (
                    <span
                      className={`font-semibold ${
                        index + 1 === 2
                          ? "text-silver-500"
                          : index + 1 === 3
                          ? "text-bronze-500"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-2 px-4 border-b border-gray-200">
                  {u.username}
                </TableCell>
                <TableCell className="py-2 px-4 border-b border-gray-200">
                  {u.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
