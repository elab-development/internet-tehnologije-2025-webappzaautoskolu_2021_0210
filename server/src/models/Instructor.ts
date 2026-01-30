import { Schema, model, Types } from 'mongoose';

const instructorSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
     experienceYears: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Instructor = model('Instructor', instructorSchema);
