import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { Pane } from "split-pane-react";
import { useGlobalContext } from "../../context";
import { CircleCheckBig } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../config";
import { toast } from "sonner";
import { Editor } from "@monaco-editor/react";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const ProblemStatement = ({ problem }) => {
  const constraints = problem[0].constraints
    .split(". ")
    .filter((c) => c.trim());
  const problemId = problem[0]._id;

  const { user } = useGlobalContext();
  const { contestId, slug } = useParams();
  const [contest, setContest] = useState();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState();
  const [activeTab, setActiveTab] = useState("problemdescription");

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/contests/${contestId}`,
          {
            withCredentials: true,
          }
        );
        setContest(response.data.contest);
      } catch (error) {
        toast.error("Failed to fetch contest");
        console.error("Failed to fetch contest:", error);
      }
    };
    if (contestId) {
      fetchContest();
    }
  }, [contestId]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      let body;
      if (contestId) body = { problemId, userId: user?.userId, contestId };
      else body = { problemId, userId: user?.userId };
      try {
        const response = await axios.post(
          `${url}/api/v1/submissions/getSubmissionsData`,
          body,
          {
            withCredentials: true,
          }
        );
        setSubmissions(response.data.submissions);
      } catch (error) {
        toast.error(error.response.data.message);
        console.error("Failed to fetch submissions:", error);
      }
    };
    if (activeTab === "submissions") {
      fetchSubmissions();
    }
  }, [activeTab, contestId, problemId, user?.userId]);

  // console.log(submissions);

  const isSolvedByUser = (contestId, user, slug) => {
    if (contestId) {
      const problem = contest?.problems.find((p) => p.slug === slug);
      return problem ? problem.solvedBy.includes(user?.userId) : false;
    }
    return problem[0]?.solvedBy.includes(user?.userId) || false;
  };

  const isSolved = isSolvedByUser(contestId, user, slug);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleOpenSubmission = (submission) => {
    setSelectedSubmission(submission);
    onOpen();
  };

  return (
    <Pane maxSize="50%" className="p-6 overflow-y-scroll thin-scrollbar">
      <Tabs
        aria-label="Options"
        variant="solid"
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
      >
        <Tab key="problemdescription" title="Description">
          <div className="h-screen">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold mb-4 text-gray-700">
                {problem[0].title}
              </h1>
              <div className="flex items-center gap-x-2">
                <Chip
                  variant="flat"
                  color={
                    problem[0].difficulty === "Easy"
                      ? "success"
                      : problem[0].difficulty === "Medium"
                      ? "warning"
                      : problem[0].difficulty === "Hard"
                      ? "danger"
                      : "default"
                  }
                >
                  {problem[0].difficulty}
                </Chip>
                {isSolved && <CircleCheckBig color="#22c55e" />}
              </div>
            </div>
            <p className="text-medium mb-4">{problem[0].description}</p>
            <h2 className="text-lg font-semibold mb-2">Examples</h2>
            {problem[0].testCases.map((example, index) => (
              <div key={index} className="mb-4">
                <p>
                  <strong className="text-gray-800">Input:</strong>{" "}
                  {example.input}
                </p>
                <p>
                  <strong>Output:</strong> {example.output}
                </p>
              </div>
            ))}

            <h2 className="text-lg font-semibold my-3">Constraints</h2>
            <div className="flex flex-wrap gap-2">
              {constraints.map((constraint, index) => (
                <Chip
                  key={index}
                  className="w-fit"
                  color="default"
                  variant="flat"
                >
                  <p className="m-0">{constraint.trim()}.</p>
                </Chip>
              ))}
            </div>

            <div className="flex flex-row items-center gap-x-3 mt-4">
              <h2 className="text-lg font-semibold">Time Limit</h2>
              <p>{problem[0].timelimit}s</p>
            </div>

            <h2 className="text-lg font-semibold my-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {problem[0].tags.map((tag, index) => (
                <Chip
                  key={index}
                  className="w-fit"
                  color="primary"
                  variant="flat"
                >
                  <p className="m-0">{tag.trim()}</p>
                </Chip>
              ))}
            </div>
          </div>
        </Tab>
        <Tab key="submissions" title="Submissions">
          <Table>
            <TableHeader>
              <TableColumn>Language</TableColumn>
              <TableColumn>Output</TableColumn>
              <TableColumn>Submitted At</TableColumn>
            </TableHeader>
            <TableBody>
              {submissions.map((submission, index) => (
                <TableRow
                  key={index}
                  className="cursor-pointer"
                  onClick={() => handleOpenSubmission(submission)}
                >
                  <TableCell>
                    {submission.language.charAt(0).toUpperCase() +
                      submission.language.slice(1)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      color={
                        submission.output === "accepted" ? "success" : "danger"
                      }
                    >
                      {submission.output.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatDateTime(submission.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
            <ModalContent>
              <>
                <ModalHeader className="flex flex-row gap-x-20">
                  {selectedSubmission?.language.charAt(0).toUpperCase() +
                    selectedSubmission?.language.slice(1)}
                  code{" "}
                  <Chip
                    variant="flat"
                    size="lg"
                    color={
                      selectedSubmission?.output === "accepted"
                        ? "success"
                        : "danger"
                    }
                  >
                    {selectedSubmission?.output.toUpperCase()}
                  </Chip>
                </ModalHeader>
                <ModalBody>
                  <Editor
                    height="80vh"
                    language={selectedSubmission?.language}
                    theme="vs-dark"
                    value={selectedSubmission?.code}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            </ModalContent>
          </Modal>
        </Tab>
      </Tabs>
    </Pane>
  );
};

export default ProblemStatement;
