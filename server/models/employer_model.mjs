import mongoose from "mongoose";
import employer_schema from "../schemas/employer_schema.mjs";

export default Employer = mongoose.model("employers", employer_schema);