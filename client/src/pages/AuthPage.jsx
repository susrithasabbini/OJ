import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { EyeSlashFilledIcon } from "../icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../icons/EyeFilledIcon";
import { Link } from "react-router-dom";

const AuthPage = ({ as }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="bg-gray-200 flex items-center justify-center h-[90%] w-full">
      <div className="flex flex-col gap-y-4 bg-white p-10 rounded-xl">
        {as === "signup" && (
          <Input type="text" label="Username" className="lg:w-80 md:w-52" />
        )}
        <Input type="email" label="Email" className="lg:w-80 md:w-52" />
        <Input
          label="Password"
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
