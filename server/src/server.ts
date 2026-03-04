import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

// ako nema MONGO_URI koristi lokalni Mongo
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/autoskola";

async function start() {
  try {
    console.log("Starting server...");
    console.log("PORT:", PORT);
    console.log("MONGO_URI:", MONGO_URI);

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err: any) {
    console.error("Startup error FULL:", err);
    console.error("Message:", err?.message);
    console.error("Name:", err?.name);
    console.error("Code:", err?.code);
    console.error("Cause:", err?.cause);
    process.exit(1);
  }
}

start();