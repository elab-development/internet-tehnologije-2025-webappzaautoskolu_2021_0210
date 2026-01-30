import { Schema, model, Types } from 'mongoose';

const vehicleSchema = new Schema(
  {
    brand: String,
    model: String,
    plateNumber: {
      type: String,
      unique: true,
    },
    instructor: {
      type: Types.ObjectId,
      ref: 'Instructor',
    },
  },
  { timestamps: true }
);

export const Vehicle = model('Vehicle', vehicleSchema);
