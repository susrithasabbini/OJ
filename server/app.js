const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

// imports
const connectDB = require("./db/connectDB");
const { PORT, MONGO_URI, ORIGIN } = require("./config");
const notFound = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

//routes
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const codeRouter = require("./routes/codeRouter");
const problemRouter = require("./routes/problemRouter");
const submissionRouter = require("./routes/submissionRouter");
const contestRouter = require("./routes/contestRouter");

const app = express();

// midleware
app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );
app.use(helmet());

const corsOptions = {
  origin: [ORIGIN],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(xss());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/code", codeRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/submissions", submissionRouter);
app.use("/api/v1/contests", contestRouter);

// error middleware
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = PORT || 5000;

const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
