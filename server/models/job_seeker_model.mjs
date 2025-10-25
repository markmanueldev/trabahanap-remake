import mongoose from "mongoose";
import {
    credentials,
    job_seeker_schema,
    job_seeker_skills,
    skills,
} from "../schemas/job_seeker_schema.mjs";

export const JobSeeker = mongoose.model("job_seekers", job_seeker_schema, "job_seekers");
export const Skill = mongoose.model("skills", skills, "skills");
export const Credential = mongoose.model("credentials", credentials, "credentials");
export const JobSeekerSkill = mongoose.model(
  "job_seeker_skills",
  job_seeker_skills,
  "job_seeker_skills"
);
