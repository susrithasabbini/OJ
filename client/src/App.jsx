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
import ProtectedRoute from "./utils/ProtectedRoute";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

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

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route element={<Root />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<AuthPage as={"login"} />} />
        <Route path="signup" element={<AuthPage as={"signup"} />} />
        <Route path="user/verify-email" exact element={<VerifyPage />} />
        <Route path="forgot-password" exact element={<ForgotPasswordPage />} />
        <Route
          path="/user/reset-password"
          exact
          element={<ResetPasswordPage />}
        />
        <Route
          path="account/:username"
          exact
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Route>
  )
);

export default function App() {
  const { isLoading } = useGlobalContext();
  if (isLoading) {
    return (
      <h1 className="text-2xl text-center text-violet-600 my-40">Loading...</h1>
    );
  }
  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Toaster />
      <RouterProvider router={Router} />
    </div>
  );
}
