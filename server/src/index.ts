import express, { json, Request, Response } from "express";
import { createRedisConnection } from "./config/redis";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.post("/submit", async (req: Request, res: Response) => {
    const problemId = req.body.problemId;
    const code = req.body.code;
    const language = req.body.language;
  try {
     const redisClient = await createRedisConnection();
     const result = await redisClient?.lPush("problem", JSON.stringify({code, language, problemId}));
     res.status(200).json({ message: "Code submitted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;

createRedisConnection().then(() => {
  console.log("Connected to Redis Server");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
