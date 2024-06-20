import "react-circular-progressbar/dist/styles.css";
import SolvedProblemsComponent from "./SolvedProblemsComponent";
import LeaderboardComponent from "./LeaderboardComponent";
import SubmissionsComponent from "./SubmissionsComponent";

const StatisticsComponent = () => {
  return (
    <div className="flex-[2]">
      <div className="flex md:flex-row flex-col md:h-[40%] h-auto md:gap-x-5 gap-y-5">
        <SolvedProblemsComponent />
        <LeaderboardComponent />
      </div>
      <div className="h-[60%] my-10">
        <SubmissionsComponent />
      </div>
    </div>
  );
};

export default StatisticsComponent;
