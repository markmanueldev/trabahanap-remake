import mongoose from "mongoose";
import path from "path";
import request from "supertest";
import { fileURLToPath } from "url";
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
  beforeEach(async () => {
    await Employer.deleteMany({});
    await JobListing.deleteMany({});
  });

  test("Should create a new job listing successfully with a complete integration flow", async () => {
    const mockEmployer = await request(app)
      .post("/api/employers/create")
      .set("Accept", "application/json")
      .field("first_name", "Test")
      .field("middle_name", "E")
      .field("last_name", "Employer")
      .field("email_address", "test_employer@gmail.com")
      .field("password", "securepassword")
      .field("house_number", 123)
      .field("street", "Test St")
      .field("city", "Test City")
      .field("barangay", "Test Barangay");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const TEST_IMAGE_DIR = path.join(__dirname, "..", "test_images");

    const IMAGE_ONE_NAME = "test-image-one.png";
    const IMAGE_TWO_NAME = "test-image-two.png";

    const IMAGE_ONE_PATH = path.join(TEST_IMAGE_DIR, IMAGE_ONE_NAME);
    const IMAGE_TWO_PATH = path.join(TEST_IMAGE_DIR, IMAGE_TWO_NAME);

    const SERVER_DIR = path.join(__dirname, "..", "..");
    const UPLOAD_DIR = path.join(SERVER_DIR, "uploads");

    const response = await request(app)
      .post("/api/job_listings/create")
      .set("Accept", "application/json")
      .field("employer_id", mockEmployer.body._id)
      .field("title", "Test Job Listing")
      .field("description", "Test Job Listing Description")
      .field("position", "Test Job Listing Position")
      .field("rate", 100)
      .field("duration", "Test Job Listing Duration")
      .field("location", "Test Job Listing Location")
      .attach("userUploads", IMAGE_ONE_PATH)
      .attach("userUploads", IMAGE_TWO_PATH);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.employer_id).toBe(mockEmployer.body._id.toString());
    expect(response.body.title).toBe("Test Job Listing");
    expect(response.body.description).toBe("Test Job Listing Description");
    expect(response.body.position).toBe("Test Job Listing Position");
    expect(response.body.rate).toBe(100);
    expect(response.body.duration).toBe("Test Job Listing Duration");
    expect(response.body.location).toBe("Test Job Listing Location");
    expect(response.body.image_urls).toBeInstanceOf(Array);
    expect(response.body.image_urls).toHaveLength(2);
    expect(response.body.image_urls[0]).toMatch(UPLOAD_DIR);
    expect(response.body.image_urls[1]).toMatch(UPLOAD_DIR);
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
