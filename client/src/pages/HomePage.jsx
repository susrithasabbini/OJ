import { BarChart2, Code, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex items-center justify-start flex-col h-[90%] w-full">
      <div className="bg-violet-700 text-white w-full flex flex-col items-center py-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to CodeJudge</h1>
        <p className="text-xl mb-8 text-center px-4 md:px-0">
          Hone your coding skills, compete in challenges, and become a better
          programmer.
        </p>
        <Link to="/signup">
          <button className="bg-white text-gray-700 px-6 py-3 rounded-full font-bold hover:scale-105">
            Get Started
          </button>
        </Link>
      </div>

      <div className="w-full max-w-7xl px-4 py-16 flex flex-wrap justify-center gap-10">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-96 transform transition duration-500 hover:scale-110">
          <div className="bg-gray-500 p-6 flex items-center justify-center">
            <Code className="text-4xl text-white" />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Practice Problems
            </h2>
            <p className="text-gray-700 mb-4">
              Solve a wide variety of coding problems to sharpen your skills.
            </p>
            <Link to="/practice-problems">
              <button className="bg-violet-600 text-white w-full py-3 rounded-full">
                Start Practicing
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-96 transform transition duration-500 hover:scale-110">
          <div className="bg-gray-500 p-6 flex items-center justify-center">
            <Trophy className="text-4xl text-white" />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Compete with Others
            </h2>
            <p className="text-gray-700 mb-4">
              Join coding competitions and see how you rank against others.
            </p>
            <Link to="/competitions">
              <button className="bg-violet-600 text-white w-full py-3 rounded-full">
                View Competitions
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-96 transform transition duration-500 hover:scale-110">
          <div className="bg-gray-500 p-6 flex items-center justify-center">
            <BarChart2 className="text-4xl text-white" />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Leaderboards
            </h2>
            <p className="text-gray-700 mb-4">
              Check out the top coders and see where you stand.
            </p>
            <Link to="/leaderboard">
              <button className="bg-violet-600 text-white w-full py-3 rounded-full">
                View Leaderboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
