import express from "express";
import { body, validationResult } from "express-validator";
import winston from "winston";
import { createJobListing } from "../../services/employer_services/create_job_listing.mjs";

const router = express.Router();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

router.post(
  "/create",
  body("employer_id").isString().notEmpty().trim().escape(),
  body("title")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Title is required"),
  body("description").isString().trim().escape(),
  body("position")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Position is required"),
  body("rate").isInt().trim().escape().withMessage("Rate is required"),
  body("duration")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Duration is required"),
  body("location")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Location is required"),
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      let uploadPath = [];

      if (req.files?.userUploads) {
        const files = Array.isArray(req.files.userUploads)
          ? req.files.userUploads
          : [req.files.userUploads];

        for (const file of files) {
          const path = path.join(__dirname, "uploads", file.name);
          await file.mv(path);
          uploadPath.push(path);
        }
      }

      const jobListingData = {
        ...req.body,
        image_urls: uploadPath,
      };

      const request = await createJobListing(jobListingData);
      logger.info(`Job listing created: ${request._id}`);
      res.status(201).json(request);
    } catch (error) {
      logger.error(`Error in /create job listing route: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
