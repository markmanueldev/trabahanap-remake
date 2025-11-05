import crypto from "crypto";
import express from "express";
import { body, validationResult } from "express-validator";
import path from "path";
import { fileURLToPath } from "url";
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
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    try {
      let uploadPath = [];

      if (req.files?.userUploads) {
        const files = Array.isArray(req.files.userUploads)
          ? req.files.userUploads
          : [req.files.userUploads];

        for (const file of files) {
          const fileExtension = path.extname(file.name);
          const uniqueSuffix = crypto.randomBytes(7).toString("hex");

          const filepath = path.join(
            __dirname,
            "..",
            "..",
            "uploads",
            `${uniqueSuffix}${fileExtension}`
          );
          await file.mv(filepath);
          uploadPath.push(filepath);
        }
      }

      const jobListingData = {
        employer_id: req.body.employer_id,
        title: req.body.title,
        description: req.body.description,
        position: req.body.position,
        rate: req.body.rate,
        duration: req.body.duration,
        location: req.body.location,
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
