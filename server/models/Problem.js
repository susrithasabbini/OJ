const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    tags: {
      type: [String],
      required: true,
    },
    solvedBy: {
      type: [String],
    },
    input: {
      type: String,
    },
    codeStubs: [
      {
        cpp: {
          type: String,
        },
        java: {
          type: String,
        },
        python: {
          type: String,
        },
      },
    ],
    output: [
      {
        cpp: {
          type: String,
        },
        java: {
          type: String,
        },
        python: {
          type: String,
        },
      },
    ],
    constraints: {
      type: String,
    },
    timelimit: {
      type: Number,
      default: 5.0,
    },
    createdBy: {
      type: String,
      required: true,
    },
    testCases: [
      {
        input: {
          type: String,
        },
        output: {
          type: String,
        },
        sample: {
          type: Boolean,
        },
        explanation: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", ProblemSchema);

module.exports = Problem;
