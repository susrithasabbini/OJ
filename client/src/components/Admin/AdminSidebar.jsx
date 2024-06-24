import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowUp,
  CirclePlus,
  Edit,
  LayoutDashboard,
  ListChecks,
  ListTodo,
  LogOut,
  User,
} from "lucide-react";
import MenuLink from "./MenuLink";
import { useGlobalContext } from "../../context";

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const { user, logoutUser } = useGlobalContext();
  const navigate = useNavigate();

  const isLinkActive = (path) => {
    return pathname === path;
  };

  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="border-r left-0 w-[17.5rem] h-[70vh] overflow-y-auto p-3 lg:flex flex-col gap-y-2 none hidden">
        <Link to="/admin">
          <div
            className={`${
              isLinkActive("/admin")
                ? "text-blue-500 bg-blue-50"
                : "text-gray-500"
            } hover:bg-gray-100 w-full px-4 transition-colors duration-300 hover:opacity-80 flex items-center gap-x-4 py-[10px] rounded-md cursor-pointer`}
          >
            <LayoutDashboard size={24} />
            <span className="text-base">Dashboard</span>
          </div>
        </Link>

        <Link to="users">
          <div
            className={`${
              isLinkActive("/admin/users")
                ? "text-blue-500 bg-blue-50"
                : "text-gray-500"
            } hover:bg-gray-100 w-full px-4 transition-colors duration-300 hover:opacity-80 flex items-center gap-x-4 py-[10px] rounded-md cursor-pointer`}
          >
            <User size={24} />
            <span className="text-base">Users</span>
          </div>
        </Link>

        <div onClick={toggleMenu}>
          <div
            className={`${
              isMenuOpen ? "text-gray-500 bg-gray-50" : "text-gray-500"
            } hover:bg-gray-100 w-full px-4 transition-colors duration-300 hover:opacity-80 flex items-center gap-x-4 py-[10px] rounded-md cursor-pointer`}
          >
            <ListChecks size={24} />
            <span className="text-base">Problems</span>
            {isMenuOpen ? (
              <ArrowUp
                className="ml-auto text-lg transition duration-300"
                color={isMenuOpen ? "#3b82f6" : "#9ca3af"}
                size={20}
              />
            ) : (
              <ArrowUp
                color={isMenuOpen ? "#3b82f6" : "#9ca3af"}
                size={20}
                className="ml-auto text-lg transform rotate-180 transition duration-300"
              />
            )}
          </div>
        </div>

        {isMenuOpen && (
          <>
            <div className="ml-8 transition duration-300 transform">
              <MenuLink
                isMenuOpen={isLinkActive("/admin/problems")}
                to="problems"
                icon={<ListTodo size={20} />}
                text="Problems List"
              />
              <MenuLink
                to="add-problem"
                isMenuOpen={isLinkActive("/admin/add-problem")}
                icon={<CirclePlus size={20} />}
                text="Add Problem"
              />
              {isLinkActive("/admin/add-problem") && (
                <MenuLink
                  to="edit-problem"
                  isMenuOpen={isLinkActive("/admin/edit-problem")}
                  icon={<Edit size={20} />}
                  text="Edit Problem"
                />
              )}
            </div>
          </>
        )}
      </div>

      <div className="border-r left-0 w-[17.5rem] h-[16vh] p-3 lg:flex flex-col gap-y-2 hidden">
        <Link to={`/account/${user?.username}`}>
          <div
            className={`${
              isLinkActive(`/account/${user?.username}`)
                ? "text-blue-500 bg-blue-50"
                : "text-gray-500"
            } hover:bg-gray-100 w-full px-4 transition-colors duration-300 hover:opacity-80 flex items-center gap-x-4 py-[10px] rounded-md cursor-pointer`}
          >
            <User size={24} />
            <span className="text-base">Profile</span>
          </div>
        </Link>
        <div
          onClick={() => {
            logoutUser();
            navigate("/");
          }}
        >
          <div
            className={`hover:bg-gray-100 w-full px-4 transition-colors duration-300 hover:opacity-80 flex items-center gap-x-4 py-[10px] rounded-md cursor-pointer`}
          >
            <LogOut className="text-red-400" size={24} />
            <span className="text-base text-red-400">Logout</span>
          </div>
        </div>
      </div>

      {/* Sidebar for medium and smaller devices (md breakpoint and below) */}
      <div className="lg:hidden bg-white shadow-md fixed bottom-0 left-0 right-0 z-50">
        <div className="flex justify-around py-2">
          <Link
            to="/admin"
            className={`${
              isLinkActive("/admin") ? "text-blue-500" : "text-gray-500"
            } flex flex-col items-center justify-center text-xs group`}
          >
            <LayoutDashboard size={24} />
            <span className="group-hover:text-blue-500">Dashboard</span>
          </Link>

          <Link
            to="/admin/users"
            className={`${
              isLinkActive("/admin/users") ? "text-blue-500" : "text-gray-500"
            } flex flex-col items-center justify-center text-xs group`}
          >
            <User size={24} />
            <span className="group-hover:text-blue-500">Users</span>
          </Link>

          <div
            className="flex flex-col items-center justify-center text-xs group"
            onClick={toggleMenu}
          >
            <ListChecks size={24} />
            <span className="group-hover:text-blue-500">Problems</span>
            <ArrowUp
              className={`mt-1 ${isMenuOpen ? "transform rotate-180" : ""}`}
              color={isMenuOpen ? "#3b82f6" : "#9ca3af"}
              size={20}
            />
          </div>
        </div>

        {isMenuOpen && (
          <div className="bg-white py-2">
            <MenuLink
              to="/admin/problems"
              icon={<ListTodo size={20} />}
              text="Problems List"
              active={isLinkActive("/admin/problems")}
            />
            <MenuLink
              to="/admin/add-problem"
              icon={<CirclePlus size={20} />}
              text="Add Problem"
              active={isLinkActive("/admin/add-problem")}
            />
            {isLinkActive("/admin/add-problem") && (
              <MenuLink
                to="/admin/edit-problem"
                icon={<Edit size={20} />}
                text="Edit Problem"
                active={isLinkActive("/admin/edit-problem")}
              />
            )}
          </div>
        )}

        <div className="flex justify-around py-2">
          <Link
            to={`/account/${user?.username}`}
            className={`${
              isLinkActive(`/account/${user?.username}`)
                ? "text-blue-500"
                : "text-gray-500"
            } flex flex-col items-center justify-center text-xs group`}
          >
            <User size={24} />
            <span className="group-hover:text-blue-500">Profile</span>
          </Link>

          <div
            className="flex flex-col items-center justify-center text-xs group"
            onClick={() => {
              logoutUser();
              navigate("/");
            }}
          >
            <LogOut className="text-red-400" size={24} />
            <span className="text-red-400 group-hover:text-red-500">
              Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
