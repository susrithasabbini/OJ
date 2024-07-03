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
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../config";
import { toast } from "sonner";

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
  const [problemsAddedData, setProblemsAddedData] = useState();
  const [usersAddedData, setUsersAddedData] = useState();
  const [submissionsData, setSubmissionsData] = useState();
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [userRolesData, setUserRolesData] = useState();
  const [userRolesLoading, setUserRolesLoading] = useState(true);

  useEffect(() => {
    setProblemsLoading(true);
    setUsersLoading(true);
    setSubmissionsLoading(true);
    setUserRolesLoading(true);
    const getProblemsAddedData = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/problems/getProblemsAdded`,
          {
            withCredentials: true,
          }
        );
        setProblemsAddedData(response.data.problemsAddedData);
        setProblemsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch problem details");
      }
    };

    const getUsersAddedData = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/users/getUsersAdded`, {
          withCredentials: true,
        });
        setUsersAddedData(response.data.usersAddedData);
        setUsersLoading(false);
      } catch (error) {
        toast.error("Failed to fetch problem details");
      }
    };

    const getSubmissionsData = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/submissions/getSubmissionsData`,
          { withCredentials: true }
        );
        setSubmissionsData(response.data.submissionsData);
        setSubmissionsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch submissions details");
      }
    };

    const getUserRolesData = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/users/getUserRoles`, {
          withCredentials: true,
        });
        setUserRolesData(response.data.userRolesData);
        setUserRolesLoading(false);
      } catch (error) {
        toast.error("Failed to fetch problem details");
      }
    };

    getProblemsAddedData();
    getSubmissionsData();
    getUsersAddedData();
    getUserRolesData();
  }, []);

  if (user.role !== "admin" && user.role !== "owner") {
    return <NotFoundPage message={"Not authorized to view this route!"} />;
  }

  const options = {
    // responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Users Joined Per Month",
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

  if (
    problemsLoading ||
    usersLoading ||
    submissionsLoading ||
    userRolesLoading
  ) {
    return (
      <h1 className="text-2xl text-center text-blue-600 my-40">Loading...</h1>
    );
  }

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
                Users Joined
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
