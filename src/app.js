import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app=express();

const defaultAllowedOrigins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173"
];

const configuredOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = configuredOrigins.includes("*")
    ? defaultAllowedOrigins
    : configuredOrigins.length
        ? configuredOrigins
        : defaultAllowedOrigins;

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS origin not allowed"));
    },
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import

import userRouter from "./routes/user.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import videoRouter from "./routes/video.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/healthcheck",healthcheckRouter)
app.use("/api/v1/dashboard",dashboardRouter)

// Global error handler — must come after all routes. Without this,
// errors thrown via ApiError (through asyncHandler's next(err)) fall
// through to Express's default handler, which returns HTML instead
// of JSON, so the frontend never sees the real error message.
import ApiError from "./utils/ApiError.js"

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    console.error(err);
    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

// http://localhost:8000/api/v1/users/register

export {app};