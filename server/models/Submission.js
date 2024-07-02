const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    problemId: {
      type: String,
      required: true,
    },
    contestId: {
      type: String,
    },
    language: {
      type: String,
      required: true,
      enum: ["cpp", "java", "python"],
    },
    code: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    executionTime: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", SubmissionSchema);
