import mongoose from "mongoose";
import chat_message_schema from "../schemas/chat_message_schema.mjs";

export default ChatMessage = mongoose.model("chat_messages", chat_message_schema);