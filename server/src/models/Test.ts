import { Schema, model } from "mongoose";

const testQuestionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => Array.isArray(value) && value.length >= 2,
        message: "Question must have at least 2 options",
      },
    },
    correctOption: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const testSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    questions: {
      type: [testQuestionSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Test = model("Test", testSchema);
