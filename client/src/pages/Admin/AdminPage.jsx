import { useGlobalContext } from "../../context";
import NotFoundPage from "../NotFoundPage";

const AdminPage = () => {
  const { user } = useGlobalContext();

  if (user.role !== "admin" || user.role !== "owner") {
    <NotFoundPage message={"Not authorized to view this route!"} />;
  }

  return (
    <>
      <div>AdminPage</div>
    </>
  );
};

export default AdminPage;
