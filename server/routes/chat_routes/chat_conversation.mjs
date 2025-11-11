import express from "express";
//import { body, validationResult } from "express-validator"
import winston from "winston";
//import { createChatConversation } from "../../services/chat_services/create_chat_conversation.mjs"
//import { getOneChatConversation } from "../../services/chat_services/get_chat_conversation.mjs"

const router = express.Router()
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

/* TODO */
router.post("/create")