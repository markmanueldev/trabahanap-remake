import mongoose from "mongoose";
import request from "supertest";
import { connectDB } from "../../connection/mongodb_connection.mjs";
import app from "../../index.mjs";
import Employer from "../../models/employer_model.mjs";

describe("Create Employee Integration Test", () => {
  beforeAll(async () => {
    await connectDB();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  beforeEach(async () => {
    await Employer.deleteMany({});
  });

  test("Should create a new employee successfully with a complete integration flow", async () => {
    //Wait a response from the server
    const response = await request(app)
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

    //Assertions for response

    expect(response.status).toBe(201);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.first_name).toBe("Test");
    expect(response.body.middle_name).toBe("E");
    expect(response.body.last_name).toBe("Employer");
    expect(response.body.email_address).toBe("test_employer@gmail.com");
    expect(response.body.house_number).toBe(123);
    expect(response.body.street).toBe("Test St");
    expect(response.body.city).toBe("Test City");
    expect(response.body.barangay).toBe("Test Barangay");
    expect(response.body.verification_status).toBe("pending");
    expect(response.body).not.toHaveProperty("password");

    //Verify data is saved in the database
    const savedEmployer = await Employer.findById(response.body._id);
    expect(savedEmployer).not.toBeNull();
    expect(savedEmployer.first_name).toBe("Test");
    expect(savedEmployer.middle_name).toBe("E");
    expect(savedEmployer.last_name).toBe("Employer");
    expect(savedEmployer.email_address).toBe("test_employer@gmail.com");
    expect(savedEmployer.house_number).toBe(123);
    expect(savedEmployer.street).toBe("Test St");
    expect(savedEmployer.city).toBe("Test City");
    expect(savedEmployer.barangay).toBe("Test Barangay");
    expect(savedEmployer.verification_status).toBe("pending");

    //Uncomment when there is hashing implemented
    //expect(savedEmployer.password).not.toBe(employerData.password);
    //expect(savedEmployer.password).toMatch(/^\$2[ab]\$\d+\$/);
  });

  test("Should return 400 for invalid data and no database entry", async () => {
    const invalidData = { first_name: "Test" };
    const response = await request(app)
      .post("/api/employers/create")
      .send(invalidData);

    //Verify if the response is 400
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");

    //Verify no entry in the database
    const employersCount = await Employer.countDocuments();
    expect(employersCount).toBe(0);
  });
});
