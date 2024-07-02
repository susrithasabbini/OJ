import { Trophy } from "lucide-react";
import { useGlobalContext } from "../../context";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../config";
import { toast } from "sonner";

const LeaderboardComponent = () => {
  const { user } = useGlobalContext();
  const [positions, setPositions] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/problems/leaderboard`, {
          withCredentials: true,
        });
        setPositions(response.data.positions);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to fetch leaderboard");
        console.error("Failed to update user:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="rounded-xl flex-[2] flex flex-col p-6 overflow-y-scroll thin-scrollbar shadow-md">
      <div className="mb-4 flex items-center justify-center gap-x-4">
        <Trophy className="text-4xl text-amber-500" size={30} />
        <p className="min-[1200px]:text-xl text-medium font-bold text-zinc-700">
          Problems Leaderboard
        </p>
      </div>
      {loading && (
        <h1 className="text-sm text-center text-blue-600">Loading...</h1>
      )}
      <div className="space-y-2">
        {positions?.map((p, i) => (
          <div
            key={i}
            className={`${
              user && user.username === p.username
                ? "bg-blue-400 text-white shadow-md"
                : "bg-white text-gray-800"
            } rounded-xl flex flex-row justify-between items-center py-3 px-4 hover:shadow-lg transition-shadow duration-300`}
          >
            <h1 className="font-bold">#{p.rank}</h1>
            <p className="font-semibold">{p.username}</p>
            <p className="font-semibold sm:block hidden">
              {p.solvedProblems} solved
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardComponent;
