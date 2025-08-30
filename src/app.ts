import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: "https://divine-shortly-buck.ngrok-free.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ Health / Keep-Alive endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is alive 🚀",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

export default app;
