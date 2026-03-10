import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import instructorRoutes from "./routes/instructorRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import lessonRequestRoutes from "./routes/lessonRequestRoutes";
import testRoutes from "./routes/testRoutes";
import externalRoutes from "./routes/externalRoutes";
import { protect } from "./middleware/authMiddleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/lesson-requests", lessonRequestRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/external", externalRoutes);

export default app;
