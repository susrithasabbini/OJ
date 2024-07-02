import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../config";
import { toast } from "sonner";

const SolvedProblemsComponent = ({ paramsUser }) => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const getSolvedProblems = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/problems/${paramsUser._id}/solvedProblems`,
          {
            withCredentials: true,
          }
        );
        setStatistics(response.data.statistics);
      } catch (error) {
        console.error("Failed to fetch solved problems:", error);
        toast.error("Failed to fetch solved problems");
      }
    };
    getSolvedProblems();
  }, [paramsUser._id]);

  const renderCircularProgressbar = (value, text, color) => (
    <CircularProgressbar
      strokeWidth={5}
      value={value}
      text={`${text}%`}
      styles={buildStyles({
        textColor: color,
        pathColor: color,
      })}
    />
  );

  return (
    <div className="rounded-xl flex-[3] flex md:flex-row flex-col gap-y-4 p-4 shadow-md">
      <div className="h-full flex-[1] flex items-center justify-center">
        <div className="md:w-32 md:h-32 h-20 w-20">
          {!statistics ? (
            <h2 className="text-center text-blue-500">Loading</h2>
          ) : (
            renderCircularProgressbar(
              statistics[3]?.totalPercentageSolved,
              statistics[3]?.totalPercentageSolved,
              "#60a5fa"
            )
          )}
        </div>
      </div>
      <div className="flex-[1] flex flex-col gap-y-2">
        {statistics?.map((stat, index) =>
          stat.difficulty ? (
            <div
              key={index}
              className="flex-[1] rounded-xl flex flex-row shadow-md"
            >
              <div className="flex-[1] flex items-center flex-col justify-center p-2">
                <h2
                  className={`min-[1200px]:text-medium text-sm font-bold ${
                    stat.difficulty === "Easy"
                      ? "text-green-600"
                      : stat.difficulty === "Medium"
                      ? "text-amber-500"
                      : "text-red-600"
                  }`}
                >
                  {stat.difficulty}
                </h2>
                <p className="text-sm">
                  {stat.solvedProblems}/{stat.problemsCount}
                </p>
              </div>
              <div className="flex-[1] flex items-center justify-center">
                <div className="min-[1200px]:w-14 min-[1200px]:h-14 w-10 h-10">
                  {renderCircularProgressbar(
                    stat.percentageSolved,
                    stat.percentageSolved,
                    stat.difficulty === "Easy"
                      ? "#16a34a"
                      : stat.difficulty === "Medium"
                      ? "#eab308"
                      : "#dc2626"
                  )}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default SolvedProblemsComponent;
