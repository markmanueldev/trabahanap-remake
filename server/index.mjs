import express from "express";
import winston from "winston";
import { connectDB } from "./connection/mongodb_connection.mjs";
import employerProfiles from "./routes/employer_routes/employer_profiles.mjs";
import jobSeekerProfiles from "./routes/job_seeker_routes/job_seeker_profiles.mjs";

const logger = winston.createLogger({
  level: "error",
  transports: [new winston.transports.Console()],
});

const app = express();
app.use(express.json());

//defined routes
app.use("/api/employers", employerProfiles);
app.use("/api/job_seekers", jobSeekerProfiles);

async function startServer() {
  try {
    await connectDB();
    app.listen(3000, () => {
      logger.info("Server is running on port 3000");
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

startServer();

export default app;