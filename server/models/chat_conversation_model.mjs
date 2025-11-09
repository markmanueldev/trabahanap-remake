import mongoose from "mongoose";
import chat_conversation_schema from "../schemas/chat_conversation_schema.mjs";

export default ChatConversation = mongoose.model("chat_conversations", chat_conversation_schema);