import { Tooltip } from "@nextui-org/react";
import axios from "axios";
import monthDaysByYear from "month-days-by-year";
import { useEffect, useState } from "react";
import { url } from "../../config";
import { toast } from "sonner";

const SubmissionsComponent = ({ paramsUser }) => {
  const days = monthDaysByYear(2024);
  const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return date.toLocaleDateString(undefined, { month: "short" });
  });
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const getUserSubmissions = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/submissions/user/${paramsUser._id}`,

          { withCredentials: true }
        );
        setSubmissions(response.data.submissions);
      } catch (error) {
        toast.error("Failed to update profile");
        console.error("Failed to update user:", error);
      }
    };
    getUserSubmissions();
  }, [paramsUser._id]);

  // Group submissions by date
  const submissionGroups = submissions.reduce((acc, submission) => {
    const date = submission.createdAt.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(submission);
    return acc;
  }, {});

  // Count active days
  const activeDaysCount = Object.keys(submissionGroups).length;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-800 font-semibold my-4">
          Submissions this year
        </h2>
        <p className="text-xs font-bold">
          Active days: <span className="text-blue-500">{activeDaysCount}</span>
        </p>
      </div>
      <div className="flex flex-row gap-3 justify-between items-center w-full overflow-x-scroll thin-scrollbar">
        {days.map((dayCount, monthIndex) => {
          const startDate = new Date(2024, monthIndex, 1);
          const startDayOfWeek = startDate.getDay();
          const gridItems = [];

          let dayIndex = 0;
          for (let col = 0; col < 6; col++) {
            const columnItems = [];
            for (let i = 0; i < 7; i++) {
              if (col === 0 && i < startDayOfWeek) {
                columnItems.push(
                  <div
                    key={`empty-${monthIndex}-${i}`}
                    className="w-2.5 h-2.5 bg-transparent"
                  ></div>
                );
              } else if (dayIndex < dayCount) {
                const currentDate = new Date(2024, monthIndex, dayIndex + 1)
                  .toISOString()
                  .split("T")[0];
                const submissionsOnDate = submissionGroups[currentDate] || [];
                const isSubmissionDate = submissionsOnDate.length > 0;
                const dateObj = new Date(currentDate);
                const formattedDate = dateObj.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const tooltipContent = isSubmissionDate
                  ? `${submissionsOnDate.length} submission(s) on ${formattedDate}`
                  : "No submissions";

                columnItems.push(
                  <Tooltip key={dayIndex} content={tooltipContent}>
                    <div
                      className={`w-2.5 h-2.5 rounded-sm ${
                        isSubmissionDate ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    ></div>
                  </Tooltip>
                );
                dayIndex++;
              } else {
                columnItems.push(
                  <div
                    key={`empty-${monthIndex}-${i}-${col}`}
                    className="w-2.5 h-2.5 bg-transparent"
                  ></div>
                );
              }
            }
            gridItems.push(
              <div key={col} className="flex flex-col gap-1">
                {columnItems}
              </div>
            );
            if (dayIndex >= dayCount) break;
          }

          return (
            <div key={monthIndex}>
              <div className="flex flex-row gap-1">{gridItems}</div>
              <p className="text-center text-gray-500 my-3">
                {monthNames[monthIndex]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionsComponent;
