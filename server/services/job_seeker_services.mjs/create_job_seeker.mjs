import winston from "winston";
import { JobSeeker } from "../../models/job_seeker_model.mjs";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export async function createJobSeeker(jobSeekerData) {
  try {
    const result = await JobSeeker.create(jobSeekerData);
    return result;
  } catch (error) {
    logger.error(`Error creating job seeker: ${error.message}`);
    throw error;
  }
}
