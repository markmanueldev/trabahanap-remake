import express from "express";
import winston from "winston";
import { createJobSeeker } from "../../services/job_seeker_services.mjs/create_job_seeker.mjs";

const router = express.Router();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

router.post("/create", async (req, res) => {
  try {
    const jobSeekerData = req.body;
    const request = await createJobSeeker(jobSeekerData);
    logger.info(`Job seeker profile created: ${request._id}`);
    res.status(201).json(request);
  } catch (error) {
    logger.error(`Error in /create job seeker route: ${error.message}`);
    res.status(400).json({ error: "Bad Request" });
  }
});

export default router;