import { Editor } from "@monaco-editor/react";
import {
  Button,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { useState } from "react";
import { Pane } from "split-pane-react";
import axios from "axios";
import { url } from "../../config";
import { useGlobalContext } from "../../context";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { RotateCcw } from "lucide-react";

const CodingEditor = ({ problem }) => {
  const [code, setCode] = useState(problem[0]?.codeStubs?.[0]?.cpp || "");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [loading, setLoading] = useState(false);
  const { user } = useGlobalContext();
  const { contestId } = useParams();
  const navigate = useNavigate();

  const handleRunCode = async () => {
    if (!user) {
      toast.warning("Please Login!");
      return;
    }
    setLoading(true);
    setOutput("Running...");
    const payload = {
      language,
      code,
      input,
    };

    try {
      const { data } = await axios.post(`${url}/api/v1/code/run`, payload, {
        withCredentials: true,
      });
      console.log(data);
      setLoading(false);
      setOutput(data.output);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setOutput(error.response.data.stderr);
    }
  };

  const handleSubmitCode = async () => {
    if (!user) {
      toast.warning("Please Login!");
      return;
    }
    setLoading(true);
    setOutput("Submitting...");
    const payload = {
      language,
      code,
      problemId: problem[0]._id,
      userId: user.userId,
      contestId,
    };
    try {
      const { data } = await axios.post(`${url}/api/v1/code/submit`, payload, {
        withCredentials: true,
      });
      console.log(data);
      setLoading(false);
      if (data.output) setOutput(data.output) || "";
      if (data.output === "accepted" && contestId) navigate(`/compete/${contestId}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setOutput(error.response.data.stderr);
    }
    setInput("");
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setInput("");
    setOutput("");
    setCode(problem[0].codeStubs[0][e.target.value]);
  };

  const handleRetriveCode = async () => {
    try {
      const { data } = await axios.post(
        `${url}/api/v1/submissions/problem/${problem[0]._id}/latestSubmission`,
        { language },
        {
          withCredentials: true,
        }
      );
      setCode(data.latestSubmission.code);
      setLanguage(data.latestSubmission.language);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Pane>
      <div className="px-6 bg-white rounded-lg shadow-md h-screen flex flex-col overflow-y-scroll thin-scrollbar">
        <div className="flex items-center justify-between">
          <Select
            size="sm"
            label="Language"
            className="max-w-xs my-3"
            defaultSelectedKeys={["cpp"]}
            placeholder="Language"
            onChange={handleLanguageChange}
          >
            <SelectItem key="cpp">Cpp</SelectItem>
            <SelectItem key="python">Python</SelectItem>
            <SelectItem key="java">Java</SelectItem>
          </Select>

          <div className="flex gap-x-3 items-center">
            {!contestId && (
              <Tooltip content="Retrieve submitted code">
                <RotateCcw
                  size="20"
                  color="#334155"
                  className="cursor-pointer"
                  onClick={handleRetriveCode}
                />
              </Tooltip>
            )}
            <Button variant="flat" color="primary" onClick={handleRunCode}>
              Run
            </Button>
            <Button
              variant="solid"
              color="success"
              className="text-white"
              onClick={handleSubmitCode}
            >
              Submit
            </Button>
          </div>
        </div>
        <Editor
          height="65vh"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
        />
        <div className="flex flex-row">
          <div className="flex-[80%]">
            <Tabs aria-label="Options" className="mt-3">
              {!loading && (
                <Tab key="input" title="Input">
                  <Textarea
                    className="w-full mb-2 flex-1"
                    placeholder="Input"
                    value={`${loading ? "Running..." : input}`}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </Tab>
              )}
              <Tab key="output" title="Output">
                <Textarea
                  className="w-full mb-2 flex-1"
                  placeholder="Output"
                  value={`${
                    output === "accepted" ||
                    output === "failed" ||
                    output === "time limit exceeded"
                      ? output.toUpperCase()
                      : output
                  }`}
                  color={
                    output === "accepted"
                      ? "success"
                      : output === "failed" || output === "time limit exceeded"
                      ? "danger"
                      : "default"
                  }
                  readOnly
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </Pane>
  );
};

export default CodingEditor;
