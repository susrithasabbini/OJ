import { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Card,
  Textarea,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { url } from "../../config";

const AdminEditProblemPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState();
  const [details, setDetails] = useState({
    slug: "",
    title: "",
    description: "",
    difficulty: "",
    constraints: "",
    input: "",
    output: "",
  });
  const [testCases, setTestCases] = useState([
    { input: "", output: "", explanation: "", sample: false },
  ]);
  const [tags, setTags] = useState([""]);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/problems/${slug}/description`,
          {
            withCredentials: true,
          }
        );
        const {
          constraints,
          description,
          difficulty,
          input,
          output,
          slug: slugData,
          title,
          testCases,
          tags,
        } = response.data.problem[0];

        setDetails({
          slug: slugData,
          difficulty,
          description,
          constraints,
          input,
          output,
          title,
        });
        setTestCases(testCases);
        setProblem(response.data.problem[0]);
        setTags(tags);
      } catch (error) {
        toast.error("Failed to fetch problem details");
      }
    };
    fetchProblemDetails();
  }, [slug]);

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDifficultyChange = (e) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      difficulty: e.target.value,
    }));
  };

  const handleTestCaseChange = (index, e) => {
    const { name, value } = e.target;
    setTestCases((prevTestCases) => {
      const newTestCases = [...prevTestCases];
      newTestCases[index][name] = value;
      return newTestCases;
    });
  };

  const handleAddTestCase = () => {
    setTestCases((prevTestCases) => [
      ...prevTestCases,
      { input: "", output: "", explanation: "", sample: false },
    ]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases((prevTestCases) => {
      const newTestCases = [...prevTestCases];
      newTestCases.splice(index, 1);
      return newTestCases;
    });
  };

  const handleTagChange = (index, e) => {
    const { value } = e.target;
    setTags((prevTags) => {
      const newTags = [...prevTags];
      newTags[index] = value;
      return newTags;
    });
  };

  const handleAddTag = () => {
    setTags((prevTags) => [...prevTags, ""]);
  };

  const handleRemoveTag = (index) => {
    setTags((prevTags) => {
      const newTags = [...prevTags];
      newTags.splice(index, 1);
      return newTags;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problemData = {
      details,
      testCases,
      tags,
    };
    try {
      await axios.put(`${url}/api/v1/problems/${problem._id}`, problemData, {
        withCredentials: true,
      });
      toast.success("Problem updated successfully");
      navigate("/admin/problems");
    } catch (error) {
      toast.error("Failed to update problem");
    }
  };

  return (
    <div className="p-6 h-fit w-full">
      <h1 className="text-2xl font-bold mb-4">Edit Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Problem Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              clearable
              underlined
              fullWidth
              autoComplete="false"
              label="Slug"
              name="slug"
              value={details?.slug}
              onChange={handleDetailChange}
              isRequired={true}
            />
            <Input
              clearable
              underlined
              autoComplete="false"
              fullWidth
              label="Title"
              name="title"
              value={details?.title}
              onChange={handleDetailChange}
              isRequired={true}
            />
          </div>
          <Textarea
            underlined
            fullWidth
            autoComplete="false"
            label="Description"
            name="description"
            value={details?.description}
            onChange={handleDetailChange}
            isRequired={true}
          />
          <RadioGroup
            label="Difficulty"
            autoComplete="false"
            onChange={handleDifficultyChange}
            value={details?.difficulty}
            name="difficulty"
            isRequired={true}
          >
            <Radio value="Easy">Easy</Radio>
            <Radio value="Medium">Medium</Radio>
            <Radio value="Hard">Hard</Radio>
          </RadioGroup>
          <Textarea
            underlined
            fullWidth
            autoComplete="false"
            label="Constraints"
            name="constraints"
            value={details?.constraints}
            onChange={handleDetailChange}
            isRequired={true}
          />
          <Input
            clearable
            underlined
            fullWidth
            label="Input Format"
            autoComplete="false"
            name="input"
            value={details?.input}
            onChange={handleDetailChange}
          />
          <Input
            clearable
            underlined
            fullWidth
            autoComplete="false"
            label="Output Format"
            name="output"
            value={details?.output}
            onChange={handleDetailChange}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Test Cases</h2>
          {testCases?.map((testCase, index) => (
            <div key={index} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  underlined
                  autoComplete="false"
                  fullWidth
                  label={`Input ${index + 1}`}
                  name="input"
                  value={testCase?.input}
                  onChange={(e) => handleTestCaseChange(index, e)}
                  isRequired={true}
                />
                <Textarea
                  underlined
                  fullWidth
                  autoComplete="false"
                  label={`Output ${index + 1}`}
                  name="output"
                  value={testCase?.output}
                  onChange={(e) => handleTestCaseChange(index, e)}
                  isRequired={true}
                />
              </div>
              <Textarea
                underlined
                fullWidth
                autoComplete="false"
                label={`Explanation ${index + 1}`}
                name="explanation"
                value={testCase?.explanation}
                onChange={(e) => handleTestCaseChange(index, e)}
              />
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sample
                </label>
                <input
                  type="checkbox"
                  name="sample"
                  autoComplete="false"
                  checked={testCase?.sample}
                  onChange={(e) => {
                    const { checked } = e.target;
                    setTestCases((prevTestCases) => {
                      const newTestCases = [...prevTestCases];
                      newTestCases[index].sample = checked;
                      return newTestCases;
                    });
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <Button
                  color="danger"
                  variant="flat"
                  auto
                  size="sm"
                  onClick={() => handleRemoveTestCase(index)}
                >
                  Remove Test Case
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={handleAddTestCase} variant="flat" color="primary">
            Add Test Case
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Tags</h2>
          {tags?.map((tag, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Input
                clearable
                underlined
                autoComplete="false"
                fullWidth
                label={`Tag ${index + 1}`}
                value={tag}
                onChange={(e) => handleTagChange(index, e)}
                isRequired={true}
              />
              <Button
                color="danger"
                variant="flat"
                size="sm"
                auto
                onClick={() => handleRemoveTag(index)}
              >
                Remove Tag
              </Button>
            </div>
          ))}
          <Button variant="flat" color="primary" onClick={handleAddTag}>
            Add Tag
          </Button>
        </Card>

        <Button type="submit" color="primary" auto>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AdminEditProblemPage;
