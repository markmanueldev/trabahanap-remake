import mongoose from "mongoose";
import request from "supertest";
import { connectDB } from "../../connection/mongodb_connection.mjs";
import app from "../../index.mjs";
import Employer from "../../models/employer_model.mjs";
import JobListing from "../../models/job_listing_model.mjs";

describe("Create Job Listing Integration Test", () => {
  beforeAll(async () => {
    await connectDB();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  afterEach(async () => {
    await Employer.deleteMany({});
    await JobListing.deleteMany({});
  });

  test("Should create a new job listing successfully with a complete integration flow", async () => {
    const employerData = {
      first_name: "Test",
      middle_name: "E",
      last_name: "Employer",
      email_address: "test_employer@gmail.com",
      password: "securepassword",
      house_number: 123,
      street: "Test St",
      city: "Test City",
      barangay: "Test Barangay",
    };

    const employer = await Employer.create(employerData);

    const jobListingData = {
      employer_id: employer._id,
      title: "Test Job Listing",
      description: "Test Job Listing Description",
      position: "Test Job Listing Position",
      rate: 100,
      duration: "Test Job Listing Duration",
      location: "Test Job Listing Location",
      image_urls: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    };

    const response = await request(app)
      .post("/api/job_listings/create")
      .send(jobListingData);

   
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.employer_id).toBe(employer._id.toString());
    expect(response.body.title).toBe(jobListingData.title);
    expect(response.body.description).toBe(jobListingData.description);
    expect(response.body.position).toBe(jobListingData.position);
    expect(response.body.rate).toBe(jobListingData.rate);
    expect(response.body.duration).toBe(jobListingData.duration);
    expect(response.body.location).toBe(jobListingData.location);
    expect(response.body.image_urls).toEqual(jobListingData.image_urls);
  });

  test("Should return 400 for invalid data and no database entry", async () => {
    const invalidData = { title: "Test Job Listing" };
    const response = await request(app)
      .post("/api/job_listings/create")
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");

    const jobListingsCount = await JobListing.countDocuments();
    expect(jobListingsCount).toBe(0);
  });
});
