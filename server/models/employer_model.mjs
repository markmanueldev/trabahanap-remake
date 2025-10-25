import mongoose from "mongoose";
import employer_schema from "../schemas/employer_schema.mjs";

const Employers = mongoose.model("employers", employer_schema);
export default Employers;