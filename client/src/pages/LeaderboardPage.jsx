import { useEffect, useState } from "react";
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
import axios from "axios";
import { url } from "../config";
import { toast } from "sonner";

const LeaderboardPage = () => {
  const { user } = useGlobalContext();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/contests/leaderboard`, {
          withCredentials: true,
        });

        console.log(response);
        setUsers(response.data.leaderboard);
      } catch (error) {
        toast.error("Failed to fetch leaderboard");
        console.error("Failed to fetch leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  const loggedInUser = users?.find((u) => u.username === user?.username);
  const loggedInUserRank =
    users?.findIndex((u) => u.username === user?.username) + 1;

  return (
    <div className="p-6 h-fit w-full">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Leaderboard</h1>

      <Card className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-blue-300 text-white shadow-lg flex items-center">
        <div className="flex flex-col items-center justify-center border-4 w-fit p-6 border-yellow-500 rounded-3xl">
          <Crown size={48} className="mb-4" color="#eab308" />
          <h2 className="text-2xl font-bold mb-2">{users[0]?.username}</h2>
          <p className="text-lg mb-4">{users[0]?.email}</p>
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
            {loggedInUserRank !== 1 && (
              <TableRow className="bg-yellow-100/60 hover:bg-blue-100 transition-all">
                <TableCell className="py-2 px-4 border-b border-gray-200 font-semibold">
                  {loggedInUserRank}
                </TableCell>
                <TableCell className="py-2 px-4 border-b border-gray-200 font-semibold">
                  {loggedInUser?.username}
                </TableCell>
                <TableCell className="py-2 px-4 border-b border-gray-200 font-semibold">
                  {loggedInUser?.points}
                </TableCell>
              </TableRow>
            )}
            {users?.map((u, index) => (
              <TableRow
                key={u.userId}
                className={`${
                  u.username === user?.username
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
