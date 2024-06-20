import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EyeSlashFilledIcon } from "../icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../icons/EyeFilledIcon";
import { toast } from "sonner";
import axios from "axios";
import { url } from "../config";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordPage = () => {
  const query = useQuery();
  const [values, setValues] = useState({
    token: query.get("token"),
    email: query.get("email"),
    password: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${url}/api/v1/auth/reset-password`,
        values,
        { withCredentials: true }
      );
      toast.success(data.message, { position: "top-center" });
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  if (loading)
    return (
      <h1 className="text-2xl text-center text-violet-600 my-40">Loading...</h1>
    );

  return (
    <div className="flex h-full my-40 justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <Input
          value={values.password}
          label="New Password"
          name="password"
          onChange={handleChange}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="lg:w-80 md:w-52"
        />
        <Button type="submit" variant="solid" color="primary">
          Reset
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
