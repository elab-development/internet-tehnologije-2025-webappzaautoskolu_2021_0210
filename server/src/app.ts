import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import instructorRoutes from "./routes/instructorRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import testRoutes from "./routes/testRoutes";
import testResultRoutes from "./routes/testResultRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import lessonRequestRoutes from "./routes/lessonRequestRoutes";
import { protect } from "./middleware/authMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/debug/me", protect, (req: any, res) => {
  res.json({ userFromToken: req.user });
});


// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/test-results", testResultRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/lesson-requests", lessonRequestRoutes);

export default app;
