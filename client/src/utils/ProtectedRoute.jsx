import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../context";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useGlobalContext();

  if (isLoading) {
    return (
      <h1 className="text-2xl text-center text-violet-600 my-40">Loading...</h1>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
