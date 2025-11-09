import mongoose from "mongoose";

const chat_conversation_schema = new mongoose.Schema({
  job_listing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "job_listings",
    required: true,
  },
  employer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employers",
    required: true,
  },
  job_seeker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "job_seekers",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

chat_conversation_schema.index({
  job_listing_id: 1,
  job_seeker_id: 1,
  unique: true,
});

export default chat_conversation_schema;
