import { Schema, model } from 'mongoose';

const vehicleSchema = new Schema(
  {
    brand: String,
    model: String,
    plateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Vehicle = model('Vehicle', vehicleSchema);
