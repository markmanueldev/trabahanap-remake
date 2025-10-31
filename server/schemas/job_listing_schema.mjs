import mongoose from "mongoose";

const job_listing_schema = new mongoose.Schema({
  employer_id: { type: mongoose.Schema.Types.ObjectId, ref: "employers" },
  title: { type: String, required: true },
  description: { type: String },
  position: { type: String, required: true },
  rate: { type: Number, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  image_urls: { type: Array, required: true },
});

job_listing_schema.index({ title: "text", description: "text" });
job_listing_schema.index({ location: 1, position: 1, rate: -1 });
job_listing_schema.index({ employer_id: 1, _id: -1 });

export default job_listing_schema;
