import { useState } from "react";
import { Input, Chip } from "@nextui-org/react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
  },
  {
    id: 6,
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
  },
  {
    id: 7,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
  },
  {
    id: 8,
    title: "Coin Change",
    difficulty: "Medium",
    tags: ["Dynamic Programming"],
  },
  {
    id: 9,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    tags: ["Tree", "Design"],
  },
  {
    id: 10,
    title: "Clone Graph",
    difficulty: "Medium",
    tags: ["Graph", "Breadth-First Search", "Depth-First Search"],
  },
  {
    id: 11,
    title: "Maximum Subarray",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
  },
  {
    id: 12,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    tags: ["Array", "Prefix Sum"],
  },
];

const tags = [
  "Array",
  "Hash Table",
  "Linked List",
  "Math",
  "Dynamic Programming",
  "Tree",
  "Graph",
  "String",
  "Sliding Window",
  "Binary Search",
  "Divide and Conquer",
  "Stack",
  "Sorting",
  "Breadth-First Search",
  "Depth-First Search",
  "Design",
  "Prefix Sum",
];

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

  const handleTagChange = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const navigate = useNavigate();

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
            {tags.map((tag) => (
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
            fullWidth
            color="primary"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-blue-100 font-bold uppercase text-sm text-gray-600">
                    Id
                  </th>
                  <th className="py-2 px-4 bg-blue-100 font-bold uppercase text-sm text-gray-600">
                    Title
                  </th>
                  <th className="py-2 px-4 bg-blue-100 font-bold uppercase text-sm text-gray-600">
                    Difficulty
                  </th>
                  <th className="py-2 px-4 bg-blue-100 font-bold uppercase text-sm text-gray-600">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((problem, index) => (
                  <tr
                    key={problem.id}
                    className={
                      index % 2 === 0
                        ? "bg-gray-100 cursor-pointer"
                        : "cursor-pointer"
                    }
                    onClick={() => navigate(`/problems/${problem.id}`)}
                  >
                    <td className="py-2 px-4 border-b border-gray-200">
                      {problem.id}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {problem.title}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
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
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {problem.tags.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PracticeProblemsPage;
