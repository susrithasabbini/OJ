import { Fragment } from "react";
import {
  RouterProvider,
  Route,
  Outlet,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavbarComponent from "./components/NavbarComponent";
import AuthPage from "./pages/AuthPage";
import { Toaster } from "sonner";
import VerifyPage from "./pages/VerifyPage";
import { useGlobalContext } from "./context";
import AccountPage from "./pages/AccountPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemsDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/Admin/AdminPage";
import AdminSidebar from "./components/Admin/AdminSidebar";
import AdminProblemsPage from "./pages/Admin/AdminProblemsPage";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminAddProblemPage from "./pages/Admin/AdminAddProblemPage";
import AdminEditProblemPage from "./pages/Admin/AdminEditProblemPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CompetePage from "./pages/CompetePage";
import ContestDetailPage from "./pages/ContestDetailPage";
import AdminContestsPage from "./pages/Admin/AdminContestsPage";
import AdminAddContestPage from "./pages/Admin/AdminAddContestPage";
import AdminEditContestPage from "./pages/Admin/AdminEditContestPage";

const Root = () => {
  const location = useLocation();
  const { user } = useGlobalContext();

  return (
    <Fragment>
      <NavbarComponent
        authLinks={
          !user &&
          (location.pathname === "/login" || location.pathname === "/signup")
        }
        user={user}
      />
      <Outlet />
    </Fragment>
  );
};

const AdminRoot = () => {
  const { user } = useGlobalContext();

  if (!user || user.role === "user") {
    return <NotFoundPage message={"Not authorized to access this route!"} />;
  }

  return (
    <Fragment>
      <div className="flex flex-row">
        <div className="flex-[1]">
          <AdminSidebar />
        </div>
        <div className="flex-[11] max-h-[88vh] overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route element={<Root />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<AuthPage as={"login"} />} />
        <Route path="/signup" element={<AuthPage as={"signup"} />} />
        <Route path="/user/verify-email" exact element={<VerifyPage />} />
        <Route path="/forgot-password" exact element={<ForgotPasswordPage />} />
        <Route
          path="/user/reset-password"
          exact
          element={<ResetPasswordPage />}
        />
        <Route path="/problems" exact element={<ProblemsPage />} />
        <Route
          path="/problems/:slug/description"
          element={<ProblemDetailPage />}
        />
        <Route
          path="/contests/:contestId/problems/:slug/description"
          element={<ProblemDetailPage />}
        />
        <Route path="/account/:username" exact element={<AccountPage />} />
        <Route path="/leaderboard" exact element={<LeaderboardPage />} />
        <Route path="/compete" exact element={<CompetePage />} />
        <Route path="/compete/:contestId" element={<ContestDetailPage />} />

        <Route path="/admin" element={<Outlet />}>
          <Route element={<AdminRoot />}>
            <Route index element={<AdminPage />} />
            <Route path="problems" element={<AdminProblemsPage />} />
            <Route path="add-problem" element={<AdminAddProblemPage />} />
            <Route
              path="edit-problem/:slug/description"
              element={<AdminEditProblemPage />}
            />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="contests" element={<AdminContestsPage />} />
            <Route path="add-contest" element={<AdminAddContestPage />} />
            <Route
              path="edit-contest/:contestId"
              element={<AdminEditContestPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Route>
  )
);

export default function App() {
  const { isLoading } = useGlobalContext();
  if (isLoading) {
    return (
      <h1 className="text-2xl text-center text-blue-600 my-40">Loading...</h1>
    );
  }
  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Toaster richColors />
      <RouterProvider router={Router} />
    </div>
  );
}
