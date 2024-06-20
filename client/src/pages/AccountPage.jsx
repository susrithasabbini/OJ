import EditProfileComponent from "../components/AccountPage/EditProfileComponent";
import StatisticsComponent from "../components/AccountPage/StatisticsComponent";

const AccountPage = () => {
  return (
    <div className="h-full w-full my-10">
      <div className="flex min-[1440px]:flex-row flex-col h-full md:mx-28 mx-8 min-[1440px]:gap-x-10 gap-y-10">
        <EditProfileComponent />
        <StatisticsComponent />
      </div>
    </div>
  );
};

export default AccountPage;
