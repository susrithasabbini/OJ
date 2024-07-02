import { Chip } from "@nextui-org/react";
import { Pane } from "split-pane-react";
import { useGlobalContext } from "../../context";
import { CircleCheckBig } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../config";
import { toast } from "sonner";

const ProblemStatement = ({ problem }) => {
  const constraints = problem[0].constraints
    .split(". ")
    .filter((c) => c.trim());

  const { user } = useGlobalContext();
  const { contestId, slug } = useParams();
  const [contest, setContest] = useState();

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

  const isSolvedByUser = (contestId, user, slug) => {
    if (contestId) {
      const problem = contest?.problems.find((p) => p.slug === slug);
      return problem ? problem.solvedBy.includes(user?.userId) : false;
    }
    return problem[0]?.solvedBy.includes(user?.userId) || false;
  };

  const isSolved = isSolvedByUser(contestId, user, slug);

  return (
    <Pane maxSize="50%">
      <div className="p-6 border-r-3 shadow-lg h-screen overflow-y-scroll thin-scrollbar">
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
              <strong className="text-gray-800">Input:</strong> {example.input}
            </p>
            <p>
              <strong>Output:</strong> {example.output}
            </p>
          </div>
        ))}

        <h2 className="text-lg font-semibold my-3">Constraints</h2>
        <div className="flex flex-wrap gap-2">
          {constraints.map((constraint, index) => (
            <Chip key={index} className="w-fit" color="default" variant="flat">
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
            <Chip key={index} className="w-fit" color="primary" variant="flat">
              <p className="m-0">{tag.trim()}</p>
            </Chip>
          ))}
        </div>
      </div>
    </Pane>
  );
};

export default ProblemStatement;
