import { useState } from "react";
import { Button, Input, Chip } from "@nextui-org/react";
import { toast } from "sonner";

const SkillsComponent = () => {
  const [skills, setSkills] = useState([
    "JavaScript",
    "React",
    "Node.js",
    "Java",
    "C++",
    "C",
    "Go",
    "Python",
  ]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() === "") {
      toast.error("Skill cannot be empty", { position: "top-center" });
      return;
    }

    if (skills.includes(newSkill)) {
      toast.error("Skill already exists", { position: "top-center" });
      return;
    }

    setSkills([...skills, newSkill]);
    setNewSkill("");
    toast.success("Skill added", { position: "top-center" });
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
    toast.success("Skill removed", { position: "top-center" });
  };

  return (
    <div className="w-full flex flex-col items-center gap-y-4">
      <h2 className="text-medium font-bold text-gray-800">Coding Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Chip
            key={skill}
            color="primary"
            variant="flat"
            isPressable
            onPress={() => handleRemoveSkill(skill)}
          >
            {skill}
          </Chip>
        ))}
      </div>
      <div className="flex gap-2 mt-4 w-full">
        <Input
          clearable
          underlined
          fullWidth
          placeholder="Add Skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />
        <Button auto onPress={handleAddSkill}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default SkillsComponent;
