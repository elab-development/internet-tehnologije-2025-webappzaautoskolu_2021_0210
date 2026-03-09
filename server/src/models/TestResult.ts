import { Schema, Types, model } from "mongoose";

const submittedAnswerSchema = new Schema(
  {
    questionIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    selectedOption: {
      type: Number,
      required: true,
      min: -1,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const testResultSchema = new Schema(
  {
    candidate: {
      type: Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    test: {
      type: Types.ObjectId,
      ref: "Test",
      required: true,
    },
    answers: {
      type: [submittedAnswerSchema],
      default: [],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    maxScore: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

testResultSchema.index({ candidate: 1, createdAt: -1 });

export const TestResult = model("TestResult", testResultSchema);
