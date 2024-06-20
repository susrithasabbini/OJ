import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { url } from "../config";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${url}/api/v1/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      toast.success(response.data.message, { position: "top-center" });
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to update user:", error);
    }
    setEmail("");
  };

  return (
    <div className="flex h-full my-40 justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <Input
          value={email}
          name="email"
          type="email"
          label="Email"
          className="lg:w-80 md:w-52"
          onChange={handleChange}
        />
        <Button type="submit" variant="solid" color="primary">
          Reset
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
