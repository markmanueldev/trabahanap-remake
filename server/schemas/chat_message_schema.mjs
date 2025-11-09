import mongoose from "mongoose";

const chat_message_schema = new mongoose.Schema({
  chat_conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chat_conversations",
    required: true,
  },
  sender_type: {
    type: String,
    enum: ["employers", "job_seekers"],
    required: true,
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "sender_type",
    required: true,
  },
  message_content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export default chat_message_schema;