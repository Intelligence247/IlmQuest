const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const env = require("./config/env");
const verifyGameRouter = require("./routes/verifyGame");

const app = express();

// CORS - Allow requests from frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

// Security headers
app.use(helmet());

// Parse JSON body
app.use(express.json());

// Request logging
app.use(morgan("tiny"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Game verification + signing route
app.use(verifyGameRouter);

// Start server
const port = env.PORT;

app.listen(port, () => {
  console.log(`IlmQuest backend running on http://localhost:${port}`);
});

