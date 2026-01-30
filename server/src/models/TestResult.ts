import { Schema, model, Types } from 'mongoose';

const testResultSchema = new Schema(
  {
    candidate: {
      type: Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    test: {
      type: Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    passedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const TestResult = model('TestResult', testResultSchema);
