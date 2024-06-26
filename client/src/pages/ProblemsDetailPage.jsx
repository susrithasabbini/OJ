import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SplitPane from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import ProblemStatement from "../components/ProblemDetail/ProblemStatement";
import CodingEditor from "../components/ProblemDetail/CodingEditor";
import axios from "axios";
import { url } from "../config";
import { toast } from "sonner";

const ProblemDetail = () => {
  const { slug } = useParams();
  const [loading, setIsLoading] = useState(true);
  const [problem, setProblem] = useState(null);

  const [sizes, setSizes] = useState(["40%", "auto"]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/problems/${slug}/description`,
          {
            withCredentials: true,
          }
        );
        setProblem(response.data.problem);
      } catch (error) {
        toast.error("Failed to fetch problem");
        console.error("Failed to fetch problem:", error);
      }
      setIsLoading(false);
    };
    fetchProblem();
  }, [slug]);

  if (loading) {
    return <div className="text-center my-40 text-2xl">Loading...</div>;
  }

  if (!problem) {
    return <div>Problem not found</div>;
  }

  return (
    <div className="h-[100%] w-full flex flex-col">
      <SplitPane
        split="vertical"
        sizes={sizes}
        onChange={(sizes) => setSizes(sizes)}
        className="custom-split-pane"
      >
        <ProblemStatement problem={problem} />
        <CodingEditor problem={problem} />
      </SplitPane>
    </div>
  );
};

export default ProblemDetail;
