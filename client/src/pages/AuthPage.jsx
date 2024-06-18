import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { EyeSlashFilledIcon } from "../icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../icons/EyeFilledIcon";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const AuthPage = ({ as }) => {
  const [isVisible, setIsVisible] = useState(false);
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
    e.preventDefault();
    const { username, email, password } = values;
    const registerUser = { username, email, password };
    const loginUser = { email, password };
    if (as === "signup") {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/api/v1/auth/register`,
          registerUser
        );
        toast(data.message);
      } catch (error) {
        console.log(error);
        toast(error.response.data.message);
      }
    } else if (as === "login") {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/api/v1/auth/login`,
          loginUser,
          { withCredentials: true }
        );
        toast(`Hi ${data.user.username}`);
      } catch (error) {
        console.log(error);
        toast(error.response.data.message);
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
            />
          )}
          <Input
            value={values.email}
            name="email"
            type="email"
            label="Email"
            className="lg:w-80 md:w-52"
            onChange={handleChange}
          />
          <Input
            value={values.password}
            label="Password"
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
          <Button
            type="submit"
            variant="solid"
            className="bg-violet-700 text-white"
          >
            {as.charAt(0).toUpperCase() + as.slice(1)}
          </Button>
        </form>

        {as === "signup" ? (
          <p className="text-gray-500 text-xs text-center">
            Already have an account?{" "}
            <span className="text-violet-600 font-bold cursor-pointer underline">
              <Link to={"/login"}>Login</Link>
            </span>
          </p>
        ) : (
          <p className="text-gray-500 text-xs text-center">
            Don&apos;t have an account?{" "}
            <span className="text-violet-600 font-bold cursor-pointer underline">
              <Link to={"/signup"}>Signup</Link>
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
