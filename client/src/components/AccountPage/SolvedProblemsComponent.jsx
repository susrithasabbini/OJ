import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const SolvedProblemsComponent = () => {
  return (
    <div className="bg-gray-100 rounded-xl flex-[3] flex md:flex-row flex-col gap-y-4 p-4">
      <div className="h-full flex-[1] flex items-center justify-center">
        <div className="md:w-32 md:h-32 h-20 w-20">
          <CircularProgressbar
            strokeWidth={4}
            value={66}
            text={`${66}%`}
            styles={buildStyles({
              textColor: "#60a5fa",
              pathColor: "#60a5fa",
            })}
          />
        </div>
      </div>
      <div className="flex-[1] flex flex-col gap-y-2">
        <div className="flex-[1] bg-gray-200 rounded-xl flex">
          <div className="flex-[1] flex items-center flex-col justify-center p-2">
            <h2 className="text-green-600 min-[1200px]:text-medium text-sm font-bold">Easy</h2>
            <p className="text-sm">25/25</p>
          </div>
          <div className="flex-[1] flex items-center justify-center">
            <div className="min-[1200px]:w-14 min-[1200px]:h-14 w-10 h-10">
              <CircularProgressbar
                strokeWidth={4}
                value={100}
                text={`${100}%`}
                styles={buildStyles({
                  textColor: "#16a34a",
                  pathColor: "#16a34a",
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex-[1] bg-gray-200 rounded-xl flex">
          <div className="flex-[1] flex items-center flex-col justify-center p-2">
            <h2 className="text-amber-500 min-[1200px]:text-medium text-sm font-bold">Medium</h2>
            <p className="text-sm">10/25</p>
          </div>
          <div className="flex-[1] flex items-center justify-center">
            <div className="min-[1200px]:w-14 min-[1200px]:h-14 w-10 h-10">
              <CircularProgressbar
                strokeWidth={4}
                value={40}
                text={`${40}%`}
                styles={buildStyles({
                  textColor: "#eab308",
                  pathColor: "#eab308",
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex-[1] bg-gray-200 rounded-xl flex">
          <div className="flex-[1] flex items-center flex-col justify-center p-2">
            <h2 className="text-red-600 min-[1200px]:text-medium text-sm font-bold">Hard</h2>
            <p className="text-sm">5/25</p>
          </div>
          <div className="flex-[1] flex items-center justify-center">
            <div className="min-[1200px]:w-14 min-[1200px]:h-14 w-10 h-10">
              <CircularProgressbar
                strokeWidth={4}
                value={20}
                text={`${20}%`}
                styles={buildStyles({
                  textColor: "#dc2626",
                  pathColor: "#dc2626",
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvedProblemsComponent;
