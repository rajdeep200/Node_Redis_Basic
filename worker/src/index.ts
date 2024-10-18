import { createClient } from "redis";
import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL,
});

async function processSubmission(submission: string) {
  const { problemId, code, language } = JSON.parse(submission);

  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);

  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log(`Finished processing submission for problemId ${problemId}.`);
}

async function startWorker() {
  try {
    await client.connect();
    console.log("Worker started...");

    while (true) {
      try {
        const submission = await client.brPop("problem", 0);
        if (submission) {
          await processSubmission(submission.element);
        }
      } catch (error) {
        console.error("Error processing submission", error);
      }
    }
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

startWorker();