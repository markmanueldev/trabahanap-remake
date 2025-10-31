import mongoose from "mongoose";
import job_listing_schema from "../schemas/job_listing_schema.mjs";

export default JobListing = mongoose.model("job_listings", job_listing_schema);
