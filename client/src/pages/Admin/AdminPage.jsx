import NotFoundPage from "../NotFoundPage";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useGlobalContext } from "../../context";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminPage = () => {
  const { user } = useGlobalContext();

  if (user.role !== "admin" && user.role !== "owner") {
    return <NotFoundPage message={"Not authorized to view this route!"} />;
  }

  const problemsAddedData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Problems Added",
        data: [30, 20, 27, 18, 23, 34, 43, 30, 25, 20, 32, 27],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const usersAddedData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Users Added",
        data: [50, 40, 47, 38, 43, 54, 63, 50, 45, 40, 52, 47],
        backgroundColor: "rgba(37, 99, 235, 0.6)",
      },
    ],
  };

  const submissionsData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Submissions",
        data: [300, 450, 400, 380, 420, 460, 550, 530, 490, 480, 520, 510],
        backgroundColor: "rgba(29, 78, 216, 0.6)",
      },
    ],
  };

  const userRolesData = {
    labels: ["Admin", "Owner", "User"],
    datasets: [
      {
        label: "User Roles",
        data: [5, 2, 93],
        backgroundColor: [
          "rgba(37, 99, 235, 0.6)",
          "rgba(29, 78, 216, 0.6)",
          "rgba(59, 130, 246, 0.6)",
        ],
      },
    ],
  };

  const options = {
    // responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Problems Added Per Month",
      },
    },
  };

  const lineOptions = {
    // responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Submissions Per Month",
      },
    },
  };

  const pieOptions = {
    // responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Roles Distribution",
      },
    },
  };

  return (
    <>
      <div className="p-6 h-fit w-full lg:block hidden">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>
        <div className="grid gap-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg h-96">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Problems Added
              </h2>
              <Bar data={problemsAddedData} options={options} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg h-96">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Users Added
              </h2>
              <Bar data={usersAddedData} options={options} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg h-96">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Submissions
              </h2>
              <Line data={submissionsData} options={lineOptions} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg h-96 flex">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                User Roles
              </h2>
              <Pie data={userRolesData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden pb-32 pt-6 h-fit w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Admin Dashboard
        </h1>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg h-full">
            <h2 className="md:text-lg text-sm font-semibold text-gray-800 mb-4">
              Problems Added
            </h2>
            <Bar data={problemsAddedData} options={options} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg h-full">
            <h2 className="md:text-lg text-sm font-semibold text-gray-800 mb-4">
              Users Added
            </h2>
            <Bar data={usersAddedData} options={options} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg h-full">
            <h2 className="md:text-lg text-sm font-semibold text-gray-800 mb-4">
              Submissions
            </h2>
            <Line data={submissionsData} options={lineOptions} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
            <h2 className="md:text-lg hidden font-semibold text-gray-800 mb-4">
              User Roles
            </h2>
            <Pie data={userRolesData} options={pieOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
