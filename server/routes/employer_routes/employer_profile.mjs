import express from "express";
import { body, validationResult } from "express-validator";
import winston from "winston";
import { createEmployer } from "../../services/employer_services/create_employer.mjs";

const router = express.Router();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

router.post(
  "/create",
  body("first_name")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("First name is required"),
  body("middle_name")
    .isString()
    .optional()
    .trim()
    .escape(),
  body("last_name")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Last name is required"),
  body("email_address")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .isEmail()
    .withMessage("Email address is required"),
  body("password")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Password is required"),
  body("house_number")
    .isInt()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("House number is required"),
  body("street")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Street is required"),
  body("city")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("City is required"),
  body("barangay")
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Barangay is required"),
  async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try {
      const employerData = req.body;
      const request = await createEmployer(employerData);
      logger.info(`Employer profile created: ${request._id}`);
      res.status(201).json(request);
    } catch (error) {
      logger.error(`Error in /create employer route: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
