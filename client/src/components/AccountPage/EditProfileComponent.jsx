import { useState } from "react";
import { useGlobalContext } from "../../context";
import axios from "axios";
import { url } from "../../config";
import { Edit3, Mail, Save, User } from "lucide-react";
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
import { EyeSlashFilledIcon } from "../../icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../../icons/EyeFilledIcon";

const EditProfileComponent = ({ isOwner, paramsUser }) => {
  const { user, saveUser } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(
    user?.username || paramsUser?.username || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUsername(user?.username || paramsUser?.username || "");
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
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Failed to update user:", error);
    }
    setIsLoading(false);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isOldVisible, setIsOldVisible] = useState(false);
  const toggleOldVisibility = () => setIsOldVisible(!isOldVisible);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const toggleNewVisibility = () => setIsNewVisible(!isNewVisible);
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const { oldPassword, newPassword } = values;
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${url}/api/v1/users/updateUserPassword`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      toast.success(response.data.message, { position: "top-center" });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to change password:", error);
    }
    setValues({ oldPassword: "", newPassword: "" });
    setIsLoading(false);
  };

  return (
    <div className="px-5 rounded-xl flex flex-1 justify-center h-fit py-10 shadow-md">
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
              className="flex items-center gap-x-2 cursor-pointer hover:scale-110 mt-3"
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
          <div className="flex items-center gap-x-3 mt-3">
            <p className="font-bold text-2xl text-gray-800">
              {user?.username || paramsUser?.username}
            </p>
            {isOwner && (
              <div
                onClick={handleEditToggle}
                className="cursor-pointer hover:scale-110"
              >
                <Edit3 size={20} />
              </div>
            )}
          </div>
        )}
        <p className="flex items-center gap-x-3 text-sm mt-2">
          <Mail color="#3b82f6" />
          <span>{user?.email || paramsUser?.email}</span>
        </p>
        {isOwner && (
          <Button
            color="primary"
            className="cursor-pointer mt-3"
            onClick={onOpen}
          >
            Change Password
          </Button>
        )}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center"
              >
                <ModalHeader className="flex flex-col gap-1">
                  Reset Password
                </ModalHeader>
                <ModalBody>
                  <Input
                    value={values.oldPassword}
                    label="Old Password"
                    name="oldPassword"
                    onChange={handleChange}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleOldVisibility}
                      >
                        {isOldVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isOldVisible ? "text" : "password"}
                    className="lg:w-80 md:w-52"
                  />
                  <Input
                    value={values.newPassword}
                    label="New Password"
                    name="newPassword"
                    onChange={handleChange}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleNewVisibility}
                      >
                        {isNewVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isNewVisible ? "text" : "password"}
                    className="lg:w-80 md:w-52"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose} type="submit">
                    Change
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
        <Divider className="my-4" />
        <SkillsComponent isOwner={isOwner} />
      </div>
    </div>
  );
};

export default EditProfileComponent;
