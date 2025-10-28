import mongoose from "mongoose";

const employer_schema = new mongoose.Schema(
  {
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
    house_number: { type: Number, required: true },
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
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

employer_schema.index({ first_name: 1, last_name: 1, email_address: 1 });

export default employer_schema;
