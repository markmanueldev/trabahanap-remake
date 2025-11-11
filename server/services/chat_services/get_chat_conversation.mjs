import winston from "winston";
import ChatConversation from "../../models/chat_conversation_model.mjs";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export async function getOneChatConversation(jobListingId, jobSeekerId) {
  try {
    const result = await ChatConversation.findOne({
      job_listing_id: jobListingId,
      job_seeker_id: jobSeekerId,
    }).exec();

    return result;
  } catch (error) {
    logger.error(`Error finding one chat conversation ${error.message}`);
    throw error;
  }
}
