import express from "express";
import cors from "cors";
import crypto from "crypto";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Your ZEGO credentials
const appID = process.env.ZEGO_APP_ID; // Example: 123456789
const serverSecret = process.env.ZEGO_SERVER_SECRET_KEY; // Example: "abcxyz..."

// middlewares
app.use(express.json());
app.use(cors());

// api end point
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/api/get-token", (req, res) => {
  const { userID } = req.query;
  if (!userID) {
    return res.status(400).send("User ID is required");
  }

  // Create a token valid for 3600 seconds (1 hour)
  const effectiveTimeInSeconds = 3600;
  const expireTime = Math.floor(Date.now() / 1000) + effectiveTimeInSeconds;

  const payloadObject = {
    app_id: appID,
    user_id: userID,
    nonce: Math.floor(Math.random() * 2147483647),
    ctime: Math.floor(Date.now() / 1000),
    expire: expireTime,
  };

  const payloadString = JSON.stringify(payloadObject);
  const hash = crypto
    .createHmac("sha256", serverSecret)
    .update(payloadString)
    .digest();
  const base64Hash = hash.toString("base64");

  const token = Buffer.from(`${base64Hash}:${payloadString}`).toString(
    "base64"
  );

  res.json({ token });
});

app.get("/", (req, res) => {
  res.send("Api working...");
});

app.listen(port, () => console.log("Server started", port));
