import winston from "winston";
import Employer from "../../models/employer_model.mjs";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});


export async function createEmployer(employerData) {
  try {
    const result = await Employer.create(employerData);
    return result;
  } catch (error) {
    logger.error(`Error creating employer: ${error.message}`);
    throw error;
  }
}
