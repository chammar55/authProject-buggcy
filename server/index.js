import express from "express";
import cors from "cors";
import passport from "passport";
import { authRouter } from "./routes/authRoutes.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import "./utils/passport.js";
import { config } from "./config/env.js";
import cookieParser from "cookie-parser";

import "./config/google-strategy.js";
import { setTokenCookie } from "./utils/jwtHelper.js";

const app = express();

app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(rateLimiter);
app.use(cookieParser());

// Routes
app.use("/api", authRouter);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_HOST}/sign-in`,
  }),
  (req, res) => {
    // Access user object and tokens from req.user
    const { user, token } = req.user;
    setTokenCookie(res, token);

    // Successful authentication, redirect home.
    res.redirect(`${process.env.FRONTEND_HOST}`);
  }
);

const port = config.port;

app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`);
});
