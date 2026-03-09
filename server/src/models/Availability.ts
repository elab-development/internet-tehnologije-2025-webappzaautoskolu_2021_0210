import { Schema, model, Types } from "mongoose";

const availabilitySchema = new Schema({
  instructor: {
    type: Types.ObjectId,
    ref: "Instructor",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  duration: {
    type: Number,
    default: 60
  },

  booked: {
    type: Boolean,
    default: false
  }
});

export const Availability = model("Availability", availabilitySchema);