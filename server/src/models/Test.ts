import { Schema, model } from 'mongoose';

const testSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    numberOfQuestions: {
      type: Number,
      required: true,
    },
    maxPoints: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Test = model('Test', testSchema);
