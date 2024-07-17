import { useEffect, useState } from "react";
import {
  Input,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../config";
import { toast } from "sonner";

const difficulties = ["Easy", "Medium", "Hard"];

const countTags = (problems) => {
  const tagCount = {};
  problems.forEach((problem) => {
    problem.tags.forEach((tag) => {
      if (tagCount[tag]) {
        tagCount[tag]++;
      } else {
        tagCount[tag] = 1;
      }
    });
  });
  return tagCount;
};

const countDifficulties = (problems) => {
  const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
  problems.forEach((problem) => {
    if (difficultyCount[problem.difficulty] !== undefined) {
      difficultyCount[problem.difficulty]++;
    }
  });
  return difficultyCount;
};

const PracticeProblemsPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/problems`, {
          withCredentials: true,
        });
        setProblems(response.data.problems);
      } catch (error) {
        toast.error("Failed to fetch problems");
        console.error("Failed to fetch problems:", error);
      }
      setIsLoading(false);
    };
    fetchProblems();
  }, []);

  const handleTagChange = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty((prevDifficulty) =>
      prevDifficulty === difficulty ? "" : difficulty
    );
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesTags =
      selectedTags.length === 0 ||
      problem.tags.some((tag) => selectedTags.includes(tag));

    const matchesDifficulty =
      selectedDifficulty === "" || problem.difficulty === selectedDifficulty;

    const matchesSearch =
      searchTerm === "" ||
      problem.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTags && matchesDifficulty && matchesSearch;
  });

  const tagCount = countTags(problems);
  const difficultyCount = countDifficulties(problems);

  const uniqueTags = Array.from(
    new Set(problems.flatMap((problem) => problem.tags))
  );

  if (loading) {
    return <div className="text-center my-40 text-2xl text-blue-600">Loading...</div>;
  }

  return (
    <div className="p-6 h-fit w-full">
      <div className="flex flex-col lg:flex-row gap-6 my-4">
        <aside className="w-full lg:w-[28%] p-4 bg-white rounded-lg shadow-md overflow-y-auto max-h-[550px] thin-scrollbar">
          <h2 className="text-sm font-semibold mb-1">Filter by Difficulty</h2>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Chip
                key={difficulty}
                onClick={() => handleDifficultyChange(difficulty)}
                className={`m-2 cursor-pointer `}
                variant="flat"
                color={
                  selectedDifficulty === difficulty && difficulty === "Easy"
                    ? "success"
                    : selectedDifficulty === difficulty &&
                      difficulty === "Medium"
                    ? "warning"
                    : selectedDifficulty === difficulty && difficulty === "Hard"
                    ? "danger"
                    : "default"
                }
                endContent={
                  selectedDifficulty === difficulty && (
                    <X size={16} className="ml-2 text-gray-600" />
                  )
                }
              >
                {difficulty}{" "}
                <span
                  className={`${
                    difficulty === "Easy"
                      ? "text-green-600"
                      : difficulty === "Medium"
                      ? "text-amber-500"
                      : difficulty === "Hard"
                      ? "text-red-600"
                      : "text-white"
                  }`}
                >
                  {" "}
                  ({difficultyCount[difficulty]})
                </span>
              </Chip>
            ))}
          </div>
          <h2 className="text-sm font-semibold mt-2 mb-1">Filter by Tags</h2>
          <div className="flex flex-wrap gap-0.5">
            {uniqueTags.map((tag) => (
              <Chip
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`m-2 cursor-pointer ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500 text-white opacity-80"
                    : "bg-gray-200 text-gray-800"
                }`}
                variant="flat"
                endContent={
                  selectedTags.includes(tag) && (
                    <X size={16} className="ml-2 text-white" />
                  )
                }
              >
                {tag}{" "}
                <span
                  className={`${
                    selectedTags.includes(tag) ? "text-white" : "text-blue-500"
                  }`}
                >
                  ({tagCount[tag]})
                </span>
              </Chip>
            ))}
          </div>
        </aside>
        <main className="w-full lg:w-3/4 p-4 bg-white rounded-lg shadow-md overflow-y-auto max-h-[550px] thin-scrollbar">
          <Input
            clearable
            underlined
            color="primary"
            placeholder="Search problems..."
            value={searchTerm}
            className="mb-2"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredProblems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full bg-white">
                <TableHeader>
                  <TableColumn>Id</TableColumn>
                  <TableColumn>Title</TableColumn>
                  <TableColumn>Difficulty</TableColumn>
                  <TableColumn>Tags</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredProblems.map((problem, index) => (
                    <TableRow
                      key={problem._id}
                      className={
                        index % 2 === 0
                          ? "bg-gray-100 cursor-pointer"
                          : "cursor-pointer"
                      }
                      onClick={() =>
                        navigate(`/problems/${problem.slug}/description`)
                      }
                    >
                      <TableCell className="py-2 px-4 border-b border-gray-200">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-2 px-4 border-b border-gray-200">
                        {problem.title}
                      </TableCell>
                      <TableCell className="py-2 px-4 border-b border-gray-200">
                        <Chip
                          variant="flat"
                          color={
                            problem.difficulty === "Easy"
                              ? "success"
                              : problem.difficulty === "Medium"
                              ? "warning"
                              : problem.difficulty === "Hard"
                              ? "danger"
                              : "default"
                          }
                        >
                          {problem.difficulty}
                        </Chip>
                      </TableCell>
                      <TableCell className="py-2 px-4 border-b border-gray-200">
                        {problem.tags.join(", ")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center my-40 text-2xl text-red-500 font-semibold">
              No problems found!
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PracticeProblemsPage;
