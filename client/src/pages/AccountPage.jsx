import EditProfileComponent from "../components/AccountPage/EditProfileComponent";
import StatisticsComponent from "../components/AccountPage/StatisticsComponent";

const AccountPage = () => {
  return (
    <div className="h-full w-full my-10">
      <div className="flex h-full mx-40 gap-x-10">
        <EditProfileComponent />
        <StatisticsComponent />
      </div>
    </div>
  );
};

export default AccountPage;
