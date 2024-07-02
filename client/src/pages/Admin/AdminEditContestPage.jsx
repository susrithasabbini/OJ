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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { url } from "../../config";
import { parseDate } from "@internationalized/date";

const AdminEditContestPage = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    title: "",
    description: "",
    startDate: null,
    endDate: null,
  });
  const [allProblems, setAllProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const { contestId } = useParams();

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

    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/contests/${contestId}`,
          {
            withCredentials: true,
          }
        );
        const contestData = response.data.contest;
        setDetails({
          title: contestData.title,
          description: contestData.description,
          startDate: parseDate(contestData.startDate.split("T")[0]),
          endDate: parseDate(contestData.endDate.split("T")[0]),
        });
        setSelectedProblems(
          contestData.problems.map((p) => ({
            problemId: p._id,
            points: p.points,
            solvedBy: p.solvedBy,
          }))
        );
      } catch (error) {
        toast.error("Failed to fetch contest details");
      }
    };

    fetchAllProblems();
    fetchContest();
  }, [contestId]);

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
        points: Number(p.points),
      })),
    };

    try {
      await axios.put(`${url}/api/v1/contests/${contestId}`, contestData, {
        withCredentials: true,
      });
      toast.success("Contest updated successfully");
      navigate("/admin/contests");
    } catch (error) {
      toast.error("Failed to update contest");
    }
  };

  return (
    <div className="p-6 h-fit w-full">
      <h1 className="text-2xl font-bold mb-4">Edit Contest</h1>
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
            {details.startDate && (
              <DateInput
                label="Start Date"
                defaultValue={details.startDate}
                isRequired={true}
                onChange={(date) => handleDateChange("startDate", date)}
              />
            )}
            {details.endDate && (
              <DateInput
                label="End Date"
                defaultValue={details.endDate}
                isRequired={true}
                onChange={(date) => handleDateChange("endDate", date)}
              />
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Problems</h2>
          {selectedProblems.map((problem, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Select
                label={`Problem ${index + 1}`}
                className="max-w-xs"
                value={problem.problemId}
                onChange={(e) => handleSelectProblem(index, e.target.value)}
                defaultSelectedKeys={[problem.problemId]}
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
              <p>Solvers: {problem.solvedBy.length || 0}</p>
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

export default AdminEditContestPage;
