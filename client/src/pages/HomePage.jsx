import { BarChart2, Code, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import codingBoy from "../assets/coding_boy.svg";
import competition from "../assets/competition.svg";
import trophy from "../assets/trophy.svg";

const LandingPage = () => {
  return (
    <div className="flex items-center justify-start flex-col h-full w-full">
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white w-full flex flex-col items-center py-16 rounded-b-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to CodeJudge</h1>
        <p className="text-xl mb-8 text-center px-4 md:px-0">
          Hone your coding skills, compete in challenges, and become a better
          programmer.
        </p>
        <Link to="/signup">
          <button className="bg-white hover:bg-green-300 text-gray-700 px-6 py-3 rounded-full font-bold hover:scale-105">
            Get Started
          </button>
        </Link>
      </div>

      <div className="w-full flex flex-col items-center gap-y-32">
        <div className="flex md:flex-row flex-col items-center text-center md:gap-x-10 gap-y-10 border-b py-20 px-36">
          <img
            src={codingBoy}
            alt="Practice Problems"
            className="mt-4 w-[50%]"
          />
          <div className="flex flex-col items-center">
            <Code className="text-blue-400 mb-4" size={40} />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Practice Problems
            </h2>
            <p className="text-gray-700 mb-4">
              Solve a wide variety of coding problems to sharpen your skills.
              Our platform offers challenges in different languages and
              difficulty levels to help you improve.
            </p>
            <Link to="/problems">
              <button className="bg-blue-400 text-white px-6 py-3 rounded-full hover:scale-105">
                Start Practicing
              </button>
            </Link>
          </div>
        </div>

        <div className="flex md:flex-row flex-col-reverse items-center text-center md:gap-x-10 gap-y-10 border-b pb-20 px-36">
          <div className="flex flex-col items-center">
            <Trophy className="text-4xl text-blue-400 mb-4" size={40} />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Compete with Others
            </h2>
            <p className="text-gray-700 mb-4">
              Join coding competitions and see how you rank against others. Our
              leaderboard tracks your progress and helps you compete globally.
            </p>
            <Link to="/compete">
              <button className="bg-blue-400 text-white px-6 py-3 rounded-full hover:scale-105">
                View Competitions
              </button>
            </Link>
          </div>
          <img src={competition} alt="Competitions" className="mt-4 w-[50%]" />
        </div>

        <div className="flex md:flex-row flex-col items-center text-center md:gap-x-40 gap-y-10 border-b pb-20 px-36">
          <img src={trophy} alt="Leaderboards" className="mt-4 w-[30%]" />
          <div className="flex flex-col items-center">
            <BarChart2 className="text-4xl text-blue-400 mb-4" size={40} />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Leaderboards
            </h2>
            <p className="text-gray-700 mb-4">
              Check out the top coders and see where you stand. Our leaderboards
              are updated in real-time to reflect the latest achievements and
              scores.
            </p>
            <Link to="/leaderboard">
              <button className="bg-blue-400 text-white px-6 py-3 rounded-full hover:scale-105">
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
