import { Tooltip } from "@nextui-org/react";
import monthDaysByYear from "month-days-by-year";

const submissions = [
  { id: 1, createdAt: "2024-04-02T08:47:36" },
  { id: 2, createdAt: "2024-04-25T20:49:57" },
  { id: 3, createdAt: "2024-02-10T23:51:04" },
  { id: 4, createdAt: "2024-04-16T09:28:50" },
  { id: 5, createdAt: "2024-06-16T07:44:41" },
  { id: 6, createdAt: "2024-01-27T09:42:51" },
  { id: 7, createdAt: "2024-01-17T02:46:45" },
  { id: 8, createdAt: "2024-01-08T13:01:32" },
  { id: 9, createdAt: "2024-01-20T04:00:52" },
  { id: 10, createdAt: "2024-02-02T19:46:25" },
  { id: 11, createdAt: "2024-03-16T12:59:28" },
  { id: 12, createdAt: "2024-02-10T12:38:33" },
  { id: 13, createdAt: "2024-02-03T21:44:59" },
  { id: 14, createdAt: "2024-04-30T10:29:07" },
  { id: 15, createdAt: "2024-03-25T08:11:44" },
  { id: 16, createdAt: "2024-05-30T06:24:47" },
  { id: 17, createdAt: "2024-05-20T21:51:43" },
  { id: 18, createdAt: "2024-04-01T17:17:10" },
  { id: 19, createdAt: "2024-02-01T11:21:34" },
  { id: 20, createdAt: "2024-04-19T14:59:23" },
];

const SubmissionsComponent = () => {
  const days = monthDaysByYear(2024);
  const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return date.toLocaleDateString(undefined, { month: "short" });
  });

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
      <div className="flex flex-row gap-3 justify-between items-center w-full overflow-scroll thin-scrollbar">
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
