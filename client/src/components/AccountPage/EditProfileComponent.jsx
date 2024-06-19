import { useState } from "react";
import { useGlobalContext } from "../../context";
import axios from "axios";
import { url } from "../../config";
import { Edit3, Mail, Save, User } from "lucide-react";
import { Divider, Input, Spinner } from "@nextui-org/react";

const EditProfileComponent = () => {
  const { user, saveUser } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [isLoading, setIsLoading] = useState(false);

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
  return (
    <div className="bg-gray-100 p-5 rounded-xl flex flex-[1] justify-center">
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
        <Divider className="my-4" />
      </div>
    </div>
  );
};

export default EditProfileComponent;
