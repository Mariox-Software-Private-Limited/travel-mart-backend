const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Error Logging Model
const ErrorLog = mongoose.model(
  "ErrorLog",
  new mongoose.Schema({
    service: String,
    message: String,
    stack: String,
    timestamp: { type: Date, default: Date.now },
  })
);

app.use(cors());
app.use(express.json());
app.set("trust proxy", true);
app.use(helmet());

// ✅ Request Logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  keyGenerator: (req) => req.ip,
});
app.use(limiter);

// ✅ Centralized Error Handler
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);
  new ErrorLog({
    service: req.originalUrl,
    message: err.message,
    stack: err.stack,
  }).save();
  res.status(500).json({ message: "Internal Server Error" });
};

// ✅ Authentication Middleware for Public Services
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // ✅ Fetch user details with projection to limit fields
    const response = await axios.get(
      "http://localhost:9000/v1/api/auth/verify",
      {
        headers: { Authorization: token },
      }
    );

    if (response.data && response.data.code === 1) {
      const userDataHeader = response.headers["x-user-data"];
      req.userData = userDataHeader
        ? JSON.parse(Buffer.from(userDataHeader, "base64").toString())
        : {};

      req.headers["x-user-data"] = Buffer.from(
        JSON.stringify(req.userData)
      ).toString("base64");

      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    new ErrorLog({
      service: "/authenticateUser",
      message: error.message,
      stack: error.stack,
    }).save();
    return res
      .status(401)
      .json({ message: "Unauthorized: Token verification failed" });
  }
};

// ✅ Define Routes
const routes = [
  {
    context: "/user-service",
    target: "http://localhost:9000",
    pathRewrite: { "^/user-service": "" },
    secure: false,
    changeOrigin: true,
    authRequired: false,
  },
  {
    context: "/public-service",
    target: "http://localhost:9001",
    pathRewrite: { "^/public-service": "" },
    secure: false,
    changeOrigin: true,
    authRequired: true, // ✅ Requires authentication
  },
  {
    context: "/event",
    target: "http://localhost:7050",
    pathRewrite: { "^/event": "/event" },
    secure: false,
    changeOrigin: true,
    authRequired: true, // ✅ Requires authentication
  },
];

// ✅ Apply Routes & Middleware
routes.forEach((route) => {
  if (route.authRequired) {
    app.use(route.context, authenticateUser); // ✅ Protects routes that need authentication
  }

  app.use(
    route.context,
    createProxyMiddleware({
      target: route.target,
      pathRewrite: route.pathRewrite,
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      onProxyReq: (proxyReq, req) => {
        console.log(
          `Proxying: ${req.method} ${req.originalUrl} → ${proxyReq.path}`
        );

        if (req.headers["content-type"]?.includes("multipart/form-data")) {
          console.log("📂 Forwarding multipart/form-data request...");
        }

        if (req.headers["x-user-data"]) {
          console.log(
            "📡 Forwarding userData in headers:",
            req.headers["x-user-data"]
          );
          proxyReq.setHeader("x-user-data", req.headers["x-user-data"]);
        }
      },
      onError: (err, req, res) => {
        console.error("❌ Proxy error:", err.message);
        new ErrorLog({
          service: req.originalUrl,
          message: err.message,
          stack: err.stack,
        }).save();
        res.status(502).json({ message: "Bad Gateway: Proxy request failed." });
      },
    })
  );
});

// ✅ Health Check Endpoint
app.use("/", (req, res) => {
  return res.status(200).send({
    code: 1,
    message: "Backend is healthy!",
    data: {
      ip: req.ip,
      real_ip: req.socket.remoteAddress,
      x_forwarded_for: req.headers["x-forwarded-for"],
    },
  });
});

app.use(errorHandler);

// ✅ Start API Gateway
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
