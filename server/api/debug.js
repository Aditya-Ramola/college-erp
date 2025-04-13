import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

// Setup Express
const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug routes
app.get("/api/debug", (req, res) => {
  console.log("GET debug request received");
  res.status(200).json({
    message: "Debug GET endpoint is working",
    query: req.query,
    method: req.method,
    path: req.path,
    time: new Date().toISOString()
  });
});

app.post("/api/debug", (req, res) => {
  console.log("POST debug request received:", req.body);
  res.status(200).json({
    message: "Debug POST endpoint is working",
    receivedData: req.body,
    method: req.method,
    path: req.path,
    time: new Date().toISOString()
  });
});

// Handle OPTIONS for preflight CORS
app.options("*", (req, res) => {
  console.log("Handling OPTIONS request in debug endpoint");
  res.status(200).end();
});

// Export the serverless handler
export default function handler(req, res) {
  console.log("Debug handler invoked:", req.method, req.url);
  return app(req, res);
} 