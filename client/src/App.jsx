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

const Root = () => {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return (
      <Fragment>
        <NavbarComponent authLinks={false} />
        <Outlet />
      </Fragment>
    );
  }
  return (
    <Fragment>
      <NavbarComponent authLinks={true} />
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
      </Route>
    </Route>
  )
);

export default function App() {
  return (
    <div className="w-screen h-screen">
      <RouterProvider router={Router} />
    </div>
  );
}
