import monthDaysByYear from "month-days-by-year";

const SubmissionsComponent = () => {
  const days = monthDaysByYear(2024);
  const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return date.toLocaleDateString(undefined, { month: "short" });
  });

  return (
    <div className="flex flex-row gap-4 p-4">
      {days.map((dayCount, monthIndex) => {
        const gridItems = [];
        let dayIndex = 0;
        for (let col = 0; col < 4; col++) {
          const columnDays = Math.min(dayCount - dayIndex, 8);
          const columnItems = [];
          for (let i = 0; i < columnDays; i++) {
            columnItems.push(
              <div
                key={dayIndex}
                className="w-3 h-3 bg-gray-300 rounded-sm hover:bg-blue-500 transition duration-300 ease-in-out"
              ></div>
            );
            dayIndex++;
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
  );
};

export default SubmissionsComponent;
