const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const env = require("./config/env");
const verifyGameRouter = require("./routes/verifyGame");
const publicQuestsRouter = require("./routes/publicQuests");
const adminQuestsRouter = require("./routes/adminQuests");

const app = express();

// CORS - Allow requests from frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-admin-address",
      "x-admin-signature",
      "x-admin-message",
    ],
    exposedHeaders: ["x-admin-address", "x-admin-signature", "x-admin-message"],
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

// API routes
app.use(verifyGameRouter);
app.use(publicQuestsRouter);
app.use(adminQuestsRouter);

// Start server
const port = env.PORT;

app.listen(port, () => {
  console.log(`IlmQuest backend running on http://localhost:${port}`);
});

