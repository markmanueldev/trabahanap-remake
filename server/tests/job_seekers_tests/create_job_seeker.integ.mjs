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
  beforeEach(async () => {
    await JobSeeker.deleteMany({});
  });

  test("Should create a new job seeker successfully with a complete integration flow", async () => {
    
    //Wait a response from the server
    const response = await request(app)
      .post("/api/job_seekers/create")
      .set("Accept", "application/json")
      .field("first_name", "Test")
      .field("middle_name", "J")
      .field("last_name", "JobSeeker")
      .field("email_address", "test_job_seeker@gmail.com")
      .field("password", "securepassword")
      .field("house_number", 456)
      .field("street", "Job St")
      .field("city", "Job City")
      .field("barangay", "Job Barangay");

    //Assertions for response
    expect(response.status).toBe(201);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.first_name).toBe("Test");
    expect(response.body.middle_name).toBe("J")
    expect(response.body.last_name).toBe("JobSeeker");
    expect(response.body.house_number).toBe(456);
    expect(response.body.street).toBe("Job St");
    expect(response.body.city).toBe("Job City");
    expect(response.body.barangay).toBe("Job Barangay");
    expect(response.body.verification_status).toBe("pending");

    expect(response.body).not.toHaveProperty("password");

    //Verify data is saved in the database
    const savedJobSeeker = await JobSeeker.findById(response.body._id);
    expect(savedJobSeeker).not.toBeNull();
    expect(savedJobSeeker.first_name).toBe("Test");
    expect(savedJobSeeker.middle_name).toBe("J");
    expect(savedJobSeeker.last_name).toBe("JobSeeker");
    expect(savedJobSeeker.house_number).toBe(456);
    expect(savedJobSeeker.street).toBe("Job St");
    expect(savedJobSeeker.city).toBe("Job City");
    expect(savedJobSeeker.barangay).toBe("Job Barangay");
    expect(savedJobSeeker.verification_status).toBe("pending");

    //Uncomment if hashing is implemented
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
