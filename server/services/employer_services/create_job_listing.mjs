import winston from "winston";
import JobListing from "../../models/job_listing_model.mjs";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export async function createJobListing(jobListingData) {
  try {
    const result = await JobListing.create(jobListingData);
    return result;
  } catch (error) {
    logger.error(`Error creating job listing: ${error.message}`);
    throw error;
  }
}
