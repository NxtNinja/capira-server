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
// Configure CORS based on environment
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Define allowed origins
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001", 
      "http://127.0.0.1:3000",
      "https://divine-shortly-buck.ngrok-free.app",
    ];
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check if origin matches ngrok pattern
    if (origin.match(/^https:\/\/[\w-]+\.ngrok-free\.app$/)) {
      return callback(null, true);
    }
    
    // In production, also allow FRONTEND_URL from env
    if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL === origin) {
      return callback(null, true);
    }
    
    console.warn(`CORS: Blocked origin ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
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

// 🔧 Debug endpoint to test cookie setting
app.get("/debug/test-cookie", (req, res) => {
  console.log("Debug: Origin:", req.headers.origin);
  console.log("Debug: Headers:", req.headers);
  
  // Set a test cookie with cross-domain support
  res.cookie("test-token", "debug-value", {
    httpOnly: true,
    secure: true, // Always true for cross-domain
    sameSite: "none", // Required for cross-domain
    maxAge: 5 * 60 * 1000, // 5 minutes
  });
  
  res.json({
    message: "Test cookie set",
    origin: req.headers.origin,
    userAgent: req.headers['user-agent']
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

export default app;
