import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditProfileComponent from "../components/AccountPage/EditProfileComponent";
import StatisticsComponent from "../components/AccountPage/StatisticsComponent";
import axios from "axios";
import { url } from "../config";
import { useGlobalContext } from "../context";
import NotFoundPage from "./NotFoundPage";

const AccountPage = () => {
  const { user } = useGlobalContext();
  const [isOwner, setIsOwner] = useState(false);
  const { username } = useParams();
  const [paramsUser, setParamsUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAccountUser = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/users/${username}`, {
          withCredentials: true,
        });
        if (user && response.data.user.username === user.username) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }

        setParamsUser(response.data.user);
      } catch (error) {
        console.error("User not found:", error);
        setParamsUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    getAccountUser();
  }, [username, user]);

  if (isLoading) {
    return <div className="text-center my-40 text-2xl">Loading...</div>;
  }

  if (!paramsUser) {
    return <NotFoundPage message="Oops! User not found!" />;
  }

  return (
    <div className="h-full w-full my-10">
      <div className="flex min-[1440px]:flex-row flex-col h-full md:mx-28 mx-8 min-[1440px]:gap-x-10 gap-y-10">
        <EditProfileComponent isOwner={isOwner} paramsUser={paramsUser} />
        <StatisticsComponent isOwner={isOwner} />
      </div>
    </div>
  );
};

export default AccountPage;
