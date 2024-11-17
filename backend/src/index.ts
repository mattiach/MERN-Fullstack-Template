import express, { Application } from "express";
import connectToDB from "./config/db.config.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.router.js";

config();

const PORT: number = Number(process.env.PORT) || 8000;
const app: Application = express();

// middleware to enable parsing of req.body and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes for user management
app.use("/api/users", userRouter);

// middleware to handle not found routes and errors
app.use(notFound);
app.use(errorHandler);

// connect to the database
connectToDB();

app.listen(PORT, () =>
  console.log(`🖥️ Server running on port ${PORT} 😀✨👌`)
);

/*
    ========== ROUTES ==========
  - **http://localhost:8000**- BASE_URL
  - **POST /api/users** - Register a user
  - **POST /api/users/auth** - Authenticate a user and get token
  - **POST /api/users/logout** - Logout user and clear cookie
  - **GET  /api/users/profile** - Get user profile
  - **PUT  /api/users/profile** - Update profile
    =============================
*/