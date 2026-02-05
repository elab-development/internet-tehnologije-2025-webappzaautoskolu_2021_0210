import { Schema, model, Types } from "mongoose";

const lessonRequestSchema = new Schema(
  {
    candidate: { type: Types.ObjectId, ref: "Candidate", required: true },
    instructor: { type: Types.ObjectId, ref: "Instructor", required: true },

    requestedDate: { type: Date, required: true },
    duration: { type: Number, default: 60 },

    note: { type: String, trim: true, default: "" },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    instructorTitle: { type: String, trim: true, default: "" },
    rejectionReason: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export const LessonRequest = model("LessonRequest", lessonRequestSchema);
