import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const SolvedProblemsComponent = () => {
  return (
    <div className="bg-gray-100 rounded-xl flex-[3] flex p-4">
      <div className="h-full flex-[1] flex items-center justify-center">
        <div className="w-32 h-32">
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
          <div className="flex-[1] flex items-center flex-col justify-center">
            <h2 className="text-green-600 text-medium font-bold">Easy</h2>
            <p className="text-sm">25/25</p>
          </div>
          <div className="flex-[1] flex items-center justify-center">
            <div className="w-14 h-14">
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
          <div className="flex-[1] flex items-center flex-col justify-center">
            <h2 className="text-amber-500 text-medium font-bold">Medium</h2>
            <p className="text-sm">10/25</p>
          </div>
          <div className="flex-[1] flex items-center justify-center">
            <div className="w-14 h-14">
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
          <div className="flex-[1] flex items-center flex-col justify-center">
            <h2 className="text-red-600 text-medium font-bold">Hard</h2>
            <p className="text-sm">5/25</p>
          </div>
          <div className="flex-[1] flex items-center justify-center">
            <div className="w-14 h-14">
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
