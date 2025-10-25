import mongoose from "mongoose";

export const job_seeker_schema = new mongoose.Schema({
  first_name: { type: String, required: true, index: true },
  middle_name: { type: String, default: null },
  last_name: { type: String, required: true, index: true },
  suffix_name: { type: String, default: null },
  gender: { type: String, default: null },
  birthday: { type: Date, default: null },
  age: { type: Number, default: null },
  email_address: {
    type: String,
    unique: true,
    index: true,
    default: null,
    sparse: true,
  },
  password: { type: String, default: null },
  phone_number: { type: String, default: null },
  profile_image: { type: String, default: null },
  bio: { type: String, default: null },
  house_number: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  barangay: { type: String, required: true },
  front_id: { type: String, default: null },
  back_id: { type: String, default: null },
  id_type: { type: String, default: null },
  joined_at: { type: Date, default: Date.now },
  verification_status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  availability: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available",
  },
  salary_rate: { type: Number, default: 0 },
  job_seeker_rating: { type: Number, min: 0, max: 5, default: 0 },
});

job_seeker_schema.index({ first_name: 1, last_name: 1, email_address: 1 });

export const credentials = new mongoose.Schema({
  job_seeker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "job_seekers",
    required: true,
  },
  credential_type: { type: String, default: null },
  file_path: { type: String, default: null },
  uploaded_at: { type: Date, default: Date.now },
}); 

export const skills = new mongoose.Schema({
  skill_name: { type: String, required: true, unique: true },
});

export const job_seeker_skills = new mongoose.Schema({
  job_seeker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "job_seekers",
    required: true,
  },
  skill_object_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "skills",
    required: true,
  },
  years_of_experience: { type: Number, default: 0 },
});

job_seeker_skills.index({ job_seeker_id: 1, skill_object_id: 1 }, { unique: true });



