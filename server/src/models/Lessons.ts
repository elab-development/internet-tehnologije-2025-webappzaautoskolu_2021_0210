import { Schema, model, Types } from 'mongoose';

const lessonSchema = new Schema(
  {
    candidate: {
      type: Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    instructor: {
      type: Types.ObjectId,
      ref: 'Instructor',
      required: true,
    },
    vehicle: {
      type: Types.ObjectId,
      ref: 'Vehicle',
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 45,
    },
  },
  { timestamps: true }
);

export const Lesson = model('Lesson', lessonSchema);
