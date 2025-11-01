import express from "express";
import winston from "winston";
import { connectDB } from "./connection/mongodb_connection.mjs";
import employerProfiles from "./routes/employer_routes/employer_profile.mjs";
import jobListings from "./routes/employer_routes/job_listing.mjs";
import jobSeekerProfiles from "./routes/job_seeker_routes/job_seeker_profiles.mjs";

const logger = winston.createLogger({
  level: "error",
  transports: [new winston.transports.Console()],
});

const app = express();
app.use(express.json());
app.set('trust proxy', true);


//defined routes
app.use("/api/employers", employerProfiles);
app.use("/api/job_seekers", jobSeekerProfiles);
app.use("/api/job_listings", jobListings);

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(3000, () => {
      logger.info("Server is running on port 3000");
    });
    return server;
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  startServer();
}

export default app;
