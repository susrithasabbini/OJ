import { Chip } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { url } from "../config";
import { useGlobalContext } from "../context";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { isLoading } = useGlobalContext();
  const query = useQuery();

  const verifyToken = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${url}/api/v1/auth/verify-email`, {
        verificationToken: query.get("token"),
        email: query.get("email"),
      });
      toast(data.msg);
    } catch (error) {
      console.log(error);
      setError(true);
      toast(error.response.data.msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      verifyToken();
    }
  }, [isLoading]);

  if (loading)
    return (
      <h1 className="text-2xl text-center text-violet-600 my-40">Loading...</h1>
    );

  if (error)
    return (
      <h1 className="text-2xl text-center text-red-600 my-40">
        There was an error, please double check your verification link!
      </h1>
    );

  return (
    <div className="my-40 flex items-center flex-col justify-center">
      <Chip className="bg-violet-500 p-6 text-white">Account confirmed!</Chip>
      <p className="my-2">
        Please{" "}
        <span className="text-violet-600 font-bold cursor-pointer underline">
          <Link to={"/login"}>Login</Link>
        </span>
      </p>
    </div>
  );
};

export default VerifyPage;
