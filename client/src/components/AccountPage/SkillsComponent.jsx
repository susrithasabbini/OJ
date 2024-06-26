import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";
import axios from "axios";
import { url } from "../../config";
import { X } from "lucide-react";

const SkillsComponent = ({ isOwner, paramsUser }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setSkills(paramsUser.skills);
  }, [paramsUser]);

  const handleAddSkill = async () => {
    if (newSkill.trim() === "") {
      toast.error("Skill cannot be empty", { position: "top-center" });
      return;
    }

    try {
      const response = await axios.patch(
        `${url}/api/v1/users/updateUser`,
        {
          skill: newSkill,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSkills([...skills, newSkill]);
        setNewSkill("");
        toast.success("Skill added", { position: "top-center" });
      } else {
        toast.error(response.data.message || "Failed to add skill", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error(error.response.data.message, { position: "top-center" });
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const response = await axios.patch(
        `${url}/api/v1/users/updateUser`,
        {
          skillToRemove,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
        toast.success("Skill removed", { position: "top-center" });
      } else {
        toast.error(response.data.message || "Failed to remove skill", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error removing skill:", error);
      toast.error("Failed to remove skill", { position: "top-center" });
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-y-4">
      <h2 className="text-medium font-bold text-gray-800">Coding Skills</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {skills.map((skill) => (
          <div
            key={skill}
            className="flex items-center bg-blue-100 rounded-2xl px-2 py-1 gap-x-1"
          >
            <div className="text-blue-500">{skill}</div>
            {isOwner && (
              <div
                className="cursor-pointer"
                onClick={() => handleRemoveSkill(skill)}
              >
                <X color="#1e40af" size={14} />
              </div>
            )}
          </div>
        ))}
      </div>
      {isOwner && (
        <div className="flex gap-2 mt-4 w-full">
          <Input
            clearable
            underlined
            fullWidth
            placeholder="Add Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <Button auto onClick={handleAddSkill}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default SkillsComponent;
