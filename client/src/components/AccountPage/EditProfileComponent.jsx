import { useState } from "react";
import { useGlobalContext } from "../../context";
import axios from "axios";
import { url } from "../../config";
import { Edit3, Mail, MailIcon, Save, User } from "lucide-react";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "sonner";
import SkillsComponent from "./SkillsComponent";

const EditProfileComponent = () => {
  const { user, saveUser } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUsername(user?.username || "");
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${url}/api/v1/users/updateUser`,
        { username },
        { withCredentials: true }
      );
      saveUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
    setIsLoading(false);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/v1/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      toast.success(response.data.message, { position: "top-center" });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to update user:", error);
    }
    setEmail("");
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 px-5 rounded-xl flex flex-[1] justify-center h-fit py-10">
      <div className="w-full flex flex-col gap-y-3 items-center">
        <User size={50} color="#3b82f6" />
        {isEditing ? (
          <>
            <Input
              clearable
              underlined
              fullWidth
              labelPlaceholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div
              onClick={handleSave}
              className="flex items-center gap-x-2 cursor-pointer hover:scale-110"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Save size={20} /> Save
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-x-3">
            <p className="font-bold text-2xl text-gray-800">{user?.username}</p>
            <div
              onClick={handleEditToggle}
              className="cursor-pointer hover:scale-110"
            >
              <Edit3 size={20} />
            </div>
          </div>
        )}
        <p className="flex items-center gap-x-3">
          <Mail color="#3b82f6" />
          <span>{user?.email}</span>
        </p>
        <Button className="cursor-pointer" onClick={onOpen}>
          Reset Password
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <form onSubmit={handleSubmit}>
                <ModalHeader className="flex flex-col gap-1">
                  Reset Password
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    endContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Email"
                    placeholder="Enter email"
                    variant="bordered"
                    value={email}
                    onChange={handleChange}
                    name="email"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose} type="submit">
                    Send Reset Link
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
        <Divider className="my-4" />
        <SkillsComponent />
      </div>
    </div>
  );
};

export default EditProfileComponent;
