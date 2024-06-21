import { Trophy } from "lucide-react";
import { useGlobalContext } from "../../context";

const positions = [
  { username: "user1", rank: 1, solvedProblems: 40 },
  { username: "user2", rank: 2, solvedProblems: 36 },
  { username: "susritha", rank: 3, solvedProblems: 29 },
];

const LeaderboardComponent = () => {
  const { user } = useGlobalContext();

  return (
    <div className="rounded-xl flex-[2] flex flex-col p-6 overflow-y-scroll thin-scrollbar shadow-md">
      <div className="mb-4 flex items-center justify-center gap-x-4">
        <Trophy className="text-4xl text-amber-500" size={30} />
        <p className="min-[1200px]:text-xl text-medium font-bold text-zinc-700">
          Leaderboard
        </p>
      </div>
      <div className="space-y-2">
        {positions.map((p, i) => (
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
