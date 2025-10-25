import express from "express";
import winston from "winston";
import { createEmployer } from "../../services/employer_services.mjs/create_employer.mjs";

const router = express.Router();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

router.post("/create", async (req, res) => {
  try {
    const employerData = req.body;
    const request = await createEmployer(employerData);
    logger.info(`Employer profile created: ${request._id}`);
    res.status(201).json(request);
  } catch (error) {
    logger.error(`Error in /create employer route: ${error.message}`);
    res.status(400).json({ error: "Bad Request" });
  }
});

export default router;
