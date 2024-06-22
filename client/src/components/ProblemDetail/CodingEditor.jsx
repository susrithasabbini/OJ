import { Editor } from "@monaco-editor/react";
import {
  Button,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Pane } from "split-pane-react";
import { useDispatch, useSelector } from "react-redux";
import { useGlobalContext } from "../../context";
import {
  problemStatusApi,
  useGetProblemStatusQuery,
} from "../../store/services/problemStatus";
import { asyncProgrammemRun } from "../../store/codeSlice";

const CODE_SNIPPETS = {
  cpp: "#include<bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t// code\n\treturn 0;\n}",
  python: "# code",
  java: "public class Main {\n\tpublic static void main(String[] args) {\n\t\t//code\n\t}\n}",
};

const CodingEditor = () => {
  const [code, setCode] = useState(CODE_SNIPPETS["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [verdict, setVerdict] = useState("");
  const [status, setStatus] = useState("in queue");
  const dispatch = useDispatch();
  const JobId = useSelector((state) => state.code.jobId);
  const [jobId, setJobId] = useState("");
  const [skip, setSkip] = useState(false);
  const { user } = useGlobalContext();

  useEffect(() => {
    if (jobId && !skip) {
      const intervalId = setInterval(() => {
        dispatch(problemStatusApi.endpoints.getProblemStatus.initiate(jobId));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [dispatch, jobId, skip]);

  const problemData = useGetProblemStatusQuery(
    jobId,
    !!jobId && !skip ? { pollingInterval: 1000 } : { skip: true }
  );

  useEffect(() => {
    console.log("Inside useEffect - problemData:", problemData);
    if (problemData.data) {
      const { job } = problemData.data;
      console.log("Job data:", job);
      setStatus(job.status);
      setOutput(job.output || "");
      if (job.verdict) {
        setVerdict(job.verdict);
        setOutput(""); // Clear output if verdict is set
      }
      if (job.status !== "in queue") {
        setSkip(true);
      }
    }
  }, [problemData]);

  const handleRunCode = () => {
    setOutput("");
    setStatus("in queue");
    setSkip(false); // Reset skip flag to start polling again
    dispatch(asyncProgrammemRun({ code, language, input }));
  };

  const handleSubmitCode = () => {
    setOutput("Submitting code...");
    setInput("");
  };

  const handleLanguageChange = (key) => {
    setLanguage(key);
    setCode(CODE_SNIPPETS[key]);
  };

  return (
    <Pane>
      <div className="px-6 bg-white rounded-lg shadow-md h-full flex flex-col overflow-y-scroll thin-scrollbar">
        <Select
          label="Select Language"
          className="max-w-xs my-3"
          defaultSelectedKeys={["cpp"]}
          placeholder="Language"
          onChange={handleLanguageChange}
        >
          <SelectItem key="cpp">Cpp</SelectItem>
          <SelectItem key="python">Python</SelectItem>
          <SelectItem key="java">Java</SelectItem>
        </Select>
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
              <Tab key="input" title="Input">
                <Textarea
                  className="w-full mb-2 flex-1"
                  placeholder="Input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </Tab>
              <Tab key="output" title="Output">
                <Textarea
                  className="w-full mb-2 flex-1"
                  placeholder="Output"
                  value={output}
                  readOnly
                />
              </Tab>
            </Tabs>
          </div>

          <div className="flex-[20%] justify-end space-x-2 mt-3">
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
      </div>
    </Pane>
  );
};

export default CodingEditor;
