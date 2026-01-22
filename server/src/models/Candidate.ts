import { Schema, model, Types } from 'mongoose';

const candidateSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    instructor: {
      type: Types.ObjectId,
      ref: 'Instructor',
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Candidate = model('Candidate', candidateSchema);
