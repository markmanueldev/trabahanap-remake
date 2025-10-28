import mongoose from "mongoose";
import request from "supertest";
import { connectDB } from "../../connection/mongodb_connection.mjs";
import app from "../../index.mjs";
import { JobSeeker } from "../../models/job_seeker_model.mjs";

describe("Create Job Seeker Integration Test", () => {
  beforeAll(async () => {
    await connectDB();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  afterEach(async () => {
    await JobSeeker.deleteMany({});
  });

  test("Should create a new job seeker successfully with a complete integration flow", async () => {
    const jobSeekerData = {
      first_name: "Test",
      middle_name: "J",
      last_name: "JobSeeker",
      email_address: "test_job_seeker@gmail.com",
      password: "securepassword",
      house_number: 456,
      street: "Job St",
      city: "Job City",
      barangay: "Job Barangay",
    };

    //Wait a response from the server
    const response = await request(app)
      .post("/api/job_seekers/create")
      .send(jobSeekerData);
    //Assertions for response
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.first_name).toBe(jobSeekerData.first_name);
    expect(response.body.last_name).toBe(jobSeekerData.last_name);
    expect(response.body.house_number).toBe(jobSeekerData.house_number);
    expect(response.body.street).toBe(jobSeekerData.street);
    expect(response.body.city).toBe(jobSeekerData.city);
    expect(response.body.barangay).toBe(jobSeekerData.barangay);
    expect(response.body.verification_status).toBe("pending");

    expect(response.body).not.toHaveProperty("password");

    //Verify data is saved in the database
    const savedJobSeeker = await JobSeeker.findById(response.body._id);
    expect(savedJobSeeker).not.toBeNull();
    expect(savedJobSeeker.first_name).toBe(jobSeekerData.first_name);
    expect(savedJobSeeker.last_name).toBe(jobSeekerData.last_name);
    expect(savedJobSeeker.house_number).toBe(jobSeekerData.house_number);
    expect(savedJobSeeker.street).toBe(jobSeekerData.street);
    expect(savedJobSeeker.city).toBe(jobSeekerData.city);
    expect(savedJobSeeker.barangay).toBe(jobSeekerData.barangay);
    expect(savedJobSeeker.verification_status).toBe("pending");

    //expect(savedJobSeeker.password).not.toBe(jobSeekerData.password);
    //expect(savedJobSeeker.password).toMatch(/^\$2[ab]\$\d+\$/);
  });
  test("Should return 400 for invalid data and no database entry", async () => {
    const invalidData = { first_name: "Test" };
    const response = await request(app)
      .post("/api/job_seekers/create")
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");

    //Verify no data is saved in the database
    const jobSeekersInDB = await JobSeeker.find({});
    expect(jobSeekersInDB.length).toBe(0);
  });
});
