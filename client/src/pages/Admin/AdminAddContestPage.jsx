import { useEffect, useState } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Textarea,
  DateInput,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { url } from "../../config";

const AdminAddContestPage = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    title: "",
    description: "",
    startDate: null,
    endDate: null,
  });
  const [allProblems, setAllProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);

  useEffect(() => {
    const fetchAllProblems = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/problems/`, {
          withCredentials: true,
        });
        setAllProblems(response.data.problems);
      } catch (error) {
        toast.error("Failed to fetch problem details");
      }
    };
    fetchAllProblems();
  }, []);

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: date,
    }));
  };

  const handleSelectProblem = (index, value) => {
    setSelectedProblems((prevProblems) => {
      const newProblems = [...prevProblems];
      newProblems[index] = { ...newProblems[index], problemId: value };
      return newProblems;
    });
  };

  const handlePointsChange = (index, value) => {
    setSelectedProblems((prevProblems) => {
      const newProblems = [...prevProblems];
      newProblems[index] = { ...newProblems[index], points: value };
      return newProblems;
    });
  };

  const handleAddProblem = () => {
    setSelectedProblems((prevProblems) => [
      ...prevProblems,
      { problemId: "", points: "" },
    ]);
  };

  const handleRemoveProblem = (index) => {
    setSelectedProblems((prevProblems) => {
      const newProblems = [...prevProblems];
      newProblems.splice(index, 1);
      return newProblems;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contestData = {
      ...details,
      startDate: details.startDate.toString(),
      endDate: details.endDate.toString(),
      problems: selectedProblems.map((p) => ({
        problemId: p.problemId,
        points: p.points,
      })),
    };
    try {
      await axios.post(`${url}/api/v1/contests`, contestData, {
        withCredentials: true,
      });
      toast.success("Contest added successfully");
      navigate("/admin/contests");
    } catch (error) {
      toast.error("Failed to add problem");
    }
  };

  return (
    <div className="p-6 h-fit w-full">
      <h1 className="text-2xl font-bold mb-4">Add New Contest</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Contest Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              clearable
              underlined
              fullWidth
              autoComplete="off"
              label="Title"
              name="title"
              value={details.title}
              onChange={handleDetailChange}
              isRequired={true}
            />
            <Textarea
              underlined
              fullWidth
              autoComplete="off"
              label="Description"
              name="description"
              value={details.description}
              onChange={handleDetailChange}
              isRequired={true}
            />
            <DateInput
              label="Start Date"
              value={details.startDate}
              isRequired={true}
              onChange={(date) => handleDateChange("startDate", date)}
            />
            <DateInput
              label="End Date"
              value={details.endDate}
              isRequired={true}
              onChange={(date) => handleDateChange("endDate", date)}
            />
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Problems</h2>
          {selectedProblems.map((problem, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Select
                label={`Problem ${index + 1}`}
                className="max-w-xs"
                value={problem._id}
                onChange={(e) => handleSelectProblem(index, e.target.value)}
              >
                {allProblems.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.title}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="number"
                label="Points"
                className="max-w-xs"
                value={problem.points}
                onChange={(e) => handlePointsChange(index, e.target.value)}
                isRequired={true}
              />
              <Button
                color="danger"
                variant="flat"
                size="sm"
                auto
                onClick={() => handleRemoveProblem(index)}
              >
                Remove Problem
              </Button>
            </div>
          ))}
          <Button onClick={handleAddProblem} variant="flat" color="primary">
            Add Problem
          </Button>
        </div>

        <Button type="submit" color="primary" className="m-6" auto>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AdminAddContestPage;
