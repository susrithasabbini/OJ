import { useState } from "react";
import axios from "axios";
import { Input, Button, Textarea, RadioGroup, Radio } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { url } from "../../config";

const AdminAddProblemPage = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    slug: "",
    title: "",
    description: "",
    difficulty: "",
    constraints: "",
    input: null,
    cppoutput: null,
    javaoutput: null,
    pythonoutput: null,
  });
  const [testCases, setTestCases] = useState([
    { input: "", output: "", explanation: "", sample: false },
  ]);
  const [tags, setTags] = useState([""]);

  const handleDetailChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: files[0], // Store the file object
      }));
    } else {
      setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
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

    const formData = new FormData();
    formData.append("slug", details.slug);
    formData.append("title", details.title);
    formData.append("description", details.description);
    formData.append("difficulty", details.difficulty);
    formData.append("constraints", details.constraints);
    formData.append("input", details.input); // Append file object
    formData.append("cppoutput", details.cppoutput); // Append file object
    formData.append("javaoutput", details.javaoutput); // Append file object
    formData.append("pythonoutput", details.pythonoutput); // Append file object

    testCases.forEach((testCase, index) => {
      formData.append(`testCases[${index}][input]`, testCase.input);
      formData.append(`testCases[${index}][output]`, testCase.output);
      formData.append(`testCases[${index}][explanation]`, testCase.explanation);
      formData.append(`testCases[${index}][sample]`, testCase.sample);
    });

    tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    try {
      await axios.post(`${url}/api/v1/problems`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Problem added successfully");
      navigate("/admin/problems");
    } catch (error) {
      toast.error("Failed to add problem");
    }
  };

  return (
    <div className="p-6 h-fit w-full md:pb-0 pb-40">
      <h1 className="text-2xl font-bold mb-4">Add New Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Problem Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              clearable
              underlined
              fullWidth
              autoComplete="false"
              label="Slug"
              name="slug"
              value={details.slug}
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
              value={details.title}
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
            value={details.description}
            onChange={handleDetailChange}
            isRequired={true}
          />
          <RadioGroup
            label="Difficulty"
            autoComplete="false"
            onChange={handleDifficultyChange}
            value={details.difficulty}
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
            value={details.constraints}
            onChange={handleDetailChange}
            isRequired={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>Input: </p>
              <div className="flex items-center justify-center w-full mt-2">
                <label className="flex flex-row items-center gap-x-2 justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:border-gray-400">
                  <input
                    type="file"
                    name="input"
                    onChange={handleDetailChange}
                    required
                  />
                </label>
              </div>
            </div>
            <div>
              <p>Cpp Output: </p>
              <div className="flex items-center justify-center w-full mt-2">
                <label className="flex flex-row items-center gap-x-2 justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:border-gray-400">
                  <input
                    type="file"
                    name="cppoutput"
                    onChange={handleDetailChange}
                    required
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>Java Output: </p>
              <div className="flex items-center justify-center w-full mt-2">
                <label className="flex flex-row items-center gap-x-2 justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:border-gray-400">
                  <input
                    type="file"
                    name="javaoutput"
                    onChange={handleDetailChange}
                    required
                  />
                </label>
              </div>
            </div>
            <div>
              <p>Python Output: </p>
              <div className="flex items-center justify-center w-full mt-2">
                <label className="flex flex-row items-center gap-x-2 justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:border-gray-400">
                  <input
                    type="file"
                    name="pythonoutput"
                    onChange={handleDetailChange}
                    required
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Sample Test Cases</h2>
          {testCases.map((testCase, index) => (
            <div key={index} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  underlined
                  autoComplete="false"
                  fullWidth
                  label={`Input ${index + 1}`}
                  name="input"
                  value={testCase.input}
                  onChange={(e) => handleTestCaseChange(index, e)}
                  isRequired={true}
                />
                <Textarea
                  underlined
                  fullWidth
                  autoComplete="false"
                  label={`Output ${index + 1}`}
                  name="cppoutput"
                  value={testCase.cppoutput}
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
                value={testCase.explanation}
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
                  checked={testCase.sample}
                  onChange={(e) => {
                    const { checked } = e.target;
                    setTestCases((prevTestCases) => {
                      const newTestCases = [...prevTestCases];
                      newTestCases[index].sample = checked;
                      return newTestCases;
                    });
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600 cursor-pointer"
                />
                <Button
                  color="danger"
                  variant="flat"
                  auto
                  size="sm"
                  onClick={() => handleRemoveTestCase(index)}
                >
                  Remove Sample Test Case
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={handleAddTestCase} variant="flat" color="primary">
            Add Sample Test Case
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Tags</h2>
          {tags.map((tag, index) => (
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
        </div>

        <Button type="submit" color="primary" auto>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AdminAddProblemPage;
