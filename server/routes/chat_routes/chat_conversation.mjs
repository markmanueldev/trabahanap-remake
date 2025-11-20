import express from "express";
import { body, validationResult } from "express-validator";
import winston from "winston";
import { createChatConversation } from "../../services/chat_services/create_chat_conversation.mjs";
import { getOneChatConversation } from "../../services/chat_services/get_chat_conversation.mjs";

const router = express.Router();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

router.post(
  "/create",
  body("job_listing_id")
    .isMongoId()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Job listing ID is required"),
  body("job_seeker_id")
    .isMongoId()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Job seeker ID is required"),
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      const { job_listing_id, employer_id } = req.body;
      /** @todo CAUTION: YOU MUST ABSOLUTE REVISE THIS TO USE THE LOGGED IN USER'S ID FROM THE DEVICE LOCAL STORAGE */
      const job_seeker_id = req.body.job_seeker_id;

      const existingConversation = await getOneChatConversation({
        job_listing_id,
        job_seeker_id,
      });

      if (existingConversation) {
        logger.info(`Found existing conversation: ${existingConversation._id}`);
        return res.status(200).json(existingConversation);
      }

      const newConversationData = {
        job_listing_id,
        employer_id,
        job_seeker_id,
      };

      const newConversation = await createChatConversation(newConversationData);
      logger.info(`Chat conversation created: ${newConversation._id}`);
      res.status(201).json(newConversation);
    } catch (error) {
      logger.error(
        `Error in /create chat conversation route: ${error.message}`
      );
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;