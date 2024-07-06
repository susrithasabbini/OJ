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
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Leaderboard</h1>

      <div className=" flex flex-col items-center">
        <Card className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-blue-300 text-white shadow-lg flex flex-col items-center w-full max-w-sm">
          <div className="flex flex-col items-center justify-center border-4 w-full p-6 border-yellow-500 rounded-3xl">
            <Crown size={40} className="mb-4" color="#eab308" />
            <h2 className="text-2xl font-bold mb-2">{users[0]?.username}</h2>
            <p className="text-lg mb-4">{users[0]?.email}</p>
          </div>
        </Card>

        <div className="overflow-x-auto max-h-96 thin-scrollbar w-full max-w-5xl">
          <Table className="min-w-full bg-white rounded-lg shadow-lg">
            <TableHeader className="bg-blue-500 text-white">
              <TableColumn className="text-left p-4">Rank</TableColumn>
              <TableColumn className="text-left p-4">Name</TableColumn>
              <TableColumn className="text-left p-4">Points</TableColumn>
            </TableHeader>
            <TableBody>
              {loggedInUserRank !== 0 && loggedInUserRank !== 1 && (
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
                    {index + 1 <= 3 ? (
                      <Tooltip content={`${index + 1} Rank`}>
                        <Crown
                          size={24}
                          color={
                            index === 0
                              ? "#FFD700"
                              : index === 1
                              ? "#C0C0C0"
                              : "#CD7F32"
                          }
                        />
                      </Tooltip>
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
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
    </div>
  );
};

export default LeaderboardPage;
