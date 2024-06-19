import { Trophy } from "lucide-react";
import { useGlobalContext } from "../../context";

const positions = [
  { username: "user1", rank: 1, solvedProblems: 40 },
  { username: "user2", rank: 2, solvedProblems: 36 },
  { username: "susritha", rank: 3, solvedProblems: 29 },
  { username: "user3", rank: 4, solvedProblems: 18 },
  { username: "user4", rank: 5, solvedProblems: 17 },
];

const LeaderboardComponent = () => {
  const { user } = useGlobalContext();

  return (
    <div className="bg-gray-100 rounded-xl flex-[2] flex flex-col p-6 shadow-lg overflow-y-scroll thin-scrollbar">
      <div className="mb-4 flex items-center justify-center gap-x-4">
        <Trophy className="text-4xl text-amber-500" size={30} />
        <p className="text-xl font-bold text-zinc-700">Leaderboard</p>
      </div>
      <div className="space-y-2">
        {positions.map((p, i) => (
          <div
            key={i}
            className={`${
              user.username === p.username
                ? "bg-blue-400 text-white shadow-md"
                : "bg-white text-gray-800"
            } rounded-xl flex flex-row justify-between items-center py-3 px-4 hover:shadow-lg transition-shadow duration-300`}
          >
            <h1 className="font-bold">#{p.rank}</h1>
            <p className="font-semibold">{p.username}</p>
            <p className="font-semibold">{p.solvedProblems} solved</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardComponent;
