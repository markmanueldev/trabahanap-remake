import mongoose from "mongoose";
import request from "supertest";
import { connectDB } from "../../connection/mongodb_connection.mjs";
import app from "../../index.mjs";
import Employers from "../../models/employer_model.mjs";

describe("Create Employee Integration Test", () => {
  beforeAll(async () => {
    await connectDB();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  afterEach(async () => {
    await Employers.deleteMany({});
  });

  test("Should create a new employee successfully with a complete integration flow", async () => {
    const employerData = {
      first_name: "Test",
      last_name: "Employer",
      house_number: "123",
      street: "Test St",
      city: "Test City",
      barangay: "Test Barangay",
    };

    //Wait a response from the server
    const response = await request(app)
      .post("/api/employers/create")
      .send(employerData);

    //Assertions for response
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.first_name).toBe(employerData.first_name);
    expect(response.body.last_name).toBe(employerData.last_name);
    expect(response.body.house_number).toBe(employerData.house_number);
    expect(response.body.street).toBe(employerData.street);
    expect(response.body.city).toBe(employerData.city);
    expect(response.body.barangay).toBe(employerData.barangay);
    expect(response.body.verification_status).toBe("pending");

    //Verify data is saved in the database
    const savedEmployer = await Employers.findById(response.body._id);
    expect(savedEmployer).not.toBeNull();
    expect(savedEmployer.first_name).toBe(employerData.first_name);
    expect(savedEmployer.last_name).toBe(employerData.last_name);
    expect(savedEmployer.house_number).toBe(employerData.house_number);
    expect(savedEmployer.street).toBe(employerData.street);
    expect(savedEmployer.city).toBe(employerData.city);
    expect(savedEmployer.barangay).toBe(employerData.barangay);
    expect(savedEmployer.verification_status).toBe("pending");
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
    const employersCount = await Employers.countDocuments();
    expect(employersCount).toBe(0);
  });
});
