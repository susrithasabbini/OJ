import { Button, Input, Spinner } from "@nextui-org/react";
import { useState } from "react";
import { EyeSlashFilledIcon } from "../icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../icons/EyeFilledIcon";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { url } from "../config";
import { useGlobalContext } from "../context";

const AuthPage = ({ as }) => {
  const { saveUser } = useGlobalContext();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const { username, email, password } = values;
    const registerUser = { username, email, password };
    const loginUser = { email, password };
    if (as === "signup") {
      try {
        const { data } = await axios.post(
          `${url}/api/v1/auth/register`,
          registerUser
        );
        setIsLoading(false);
        toast.success(data.message);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    } else if (as === "login") {
      try {
        const { data } = await axios.post(
          `${url}/api/v1/auth/login`,
          loginUser,
          { withCredentials: true }
        );
        setIsLoading(false);
        saveUser(data.user);
        navigate("/");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="bg-gray-200 flex items-center justify-center h-[90%] w-full">
      <div className=" bg-white p-10 rounded-xl">
        <form className="flex flex-col gap-y-4 mb-3" onSubmit={onSubmit}>
          {as === "signup" && (
            <Input
              value={values.username}
              name="username"
              type="text"
              label="Username"
              className="lg:w-80 md:w-52"
              onChange={handleChange}
              isRequired={true}
            />
          )}
          <Input
            value={values.email}
            name="email"
            type="email"
            label="Email"
            className="lg:w-80 md:w-52"
            onChange={handleChange}
            isRequired={true}
          />
          <Input
            value={values.password}
            label="Password"
            name="password"
            onChange={handleChange}
            isRequired={true}
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
          {loading && <Spinner />}
          <Button type="submit" variant="solid" color="primary" isDisabled={loading}>
            {as.charAt(0).toUpperCase() + as.slice(1)}
          </Button>
        </form>

        {as === "signup" ? (
          <p className="text-gray-500 text-xs text-center">
            Already have an account?{" "}
            <span className="text-blue-600 font-bold cursor-pointer underline">
              <Link to={"/login"}>Login</Link>
            </span>
          </p>
        ) : (
          <p className="text-gray-500 text-xs text-center">
            Don&apos;t have an account?{" "}
            <span className="text-blue-600 font-bold cursor-pointer underline">
              <Link to={"/signup"}>Signup</Link>
            </span>
          </p>
        )}

        <Link
          to={"/forgot-password"}
          className="text-gray-600 font-bold cursor-pointer text-xs text-center flex justify-center mt-3"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default AuthPage;
