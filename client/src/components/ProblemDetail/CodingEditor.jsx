import { Editor } from "@monaco-editor/react";
import {
  Button,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";
import { Pane } from "split-pane-react";
import axios from "axios";
import { url } from "../../config";

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
  const [running, setRunning] = useState(false);

  const handleRunCode = async () => {
    setRunning(true);
    setOutput("Running...");
    const payload = {
      language,
      code,
      input,
    };

    try {
      const { data } = await axios.post(`${url}/api/v1/code/run`, payload);
      console.log(data);
      setRunning(false);
      setOutput(data.output);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleSubmitCode = () => {
    setOutput("Submitting code...");
    setInput("");
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(CODE_SNIPPETS[e.target.value]);
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
          <div className="flex gap-x-3">
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
              {!running && (
                <Tab key="input" title="Input">
                  <Textarea
                    className="w-full mb-2 flex-1"
                    placeholder="Input"
                    value={`${running ? "Running..." : input}`}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </Tab>
              )}
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
        </div>
      </div>
    </Pane>
  );
};

export default CodingEditor;
