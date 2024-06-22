import { useParams } from "react-router-dom";
import { useState } from "react";
import SplitPane from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import ProblemStatement from "../components/ProblemDetail/ProblemStatement";
import CodingEditor from "../components/ProblemDetail/CodingEditor";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    input: ["2, 7, 11, 15", "3, 2, 4"],
    constraints:
      "Only one valid answer exists. You may not use the same element twice.",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: [
      { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]" },
      { input: "l1 = [0], l2 = [0]", output: "[0]" },
    ],
    constraints:
      "The number of nodes in each linked list is in the range [1, 100].",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3" },
      { input: 's = "bbbbb"', output: "1" },
    ],
    constraints: "0 <= s.length <= 5 * 10^4",
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    description:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" },
    ],
    constraints: "The total length of the two arrays is up to 2 * 10^4.",
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
    ],
    constraints: "1 <= s.length <= 10^4",
  },
  {
    id: 6,
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    description:
      "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
      },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    constraints: "1 <= intervals.length <= 10^4",
  },
  {
    id: 7,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5" },
      { input: "prices = [7,6,4,3,1]", output: "0" },
    ],
    constraints: "1 <= prices.length <= 10^5",
  },
  {
    id: 8,
    title: "Coin Change",
    difficulty: "Medium",
    tags: ["Dynamic Programming"],
    description:
      "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3" },
      { input: "coins = [2], amount = 3", output: "-1" },
    ],
    constraints: "1 <= coins.length <= 12",
  },
  {
    id: 9,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    tags: ["Tree", "Design"],
    description:
      "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.",
    examples: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        output: "[1,2,3,null,null,4,5]",
      },
      { input: "root = []", output: "[]" },
    ],
    constraints: "The number of nodes in the tree is in the range [0, 10^4].",
  },
  {
    id: 10,
    title: "Clone Graph",
    difficulty: "Medium",
    tags: ["Graph", "Breadth-First Search", "Depth-First Search"],
    description:
      "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
    examples: [
      {
        input: "node = [[2,4],[1,3],[2,4],[1,3]]",
        output: "[[2,4],[1,3],[2,4],[1,3]]",
      },
      { input: "node = [[]]", output: "[[]]" },
    ],
    constraints: "The number of nodes in the graph is in the range [0, 100].",
  },
  {
    id: 11,
    title: "Maximum Subarray",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: "1 <= nums.length <= 10^5",
  },
  {
    id: 12,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    tags: ["Array", "Prefix Sum"],
    description:
      "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    constraints: "2 <= nums.length <= 10^5",
  },
];

const ProblemDetail = () => {
  const { id } = useParams();
  const problem = problems.find((p) => p.id === parseInt(id));

  const [sizes, setSizes] = useState(["35%", "auto"]);

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
        <CodingEditor />
      </SplitPane>
    </div>
  );
};

export default ProblemDetail;
