const mongoose = require("mongoose");

const ContestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    participants: {
      type: [String],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    problems: [
      {
        problemId: {
          type: String,
          required: true,
        },
        points: {
          type: Number,
          required: true,
        },
        solvedBy: {
          type: [String],
        },
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Contest = mongoose.model("Contest", ContestSchema);

module.exports = Contest;
