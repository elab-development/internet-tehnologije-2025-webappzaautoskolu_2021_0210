import { Schema, model, Types } from 'mongoose';

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: 'Čas vožnje', // za vec ubete casove
    },

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
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 60,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
);

export const Lesson = model('Lesson', lessonSchema);
