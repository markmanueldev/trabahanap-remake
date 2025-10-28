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
  afterEach(async () => {
    await Employer.deleteMany({});
  });

  test("Should create a new employee successfully with a complete integration flow", async () => {
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

    //Wait a response from the server
    const response = await request(app)
      .post("/api/employers/create")
      .send(employerData);

    //Assertions for response
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.first_name).toBe(employerData.first_name);
    expect(response.body.middle_name).toBe(employerData.middle_name);
    expect(response.body.last_name).toBe(employerData.last_name);
    expect(response.body.email_address).toBe(employerData.email_address);
    expect(response.body.house_number).toBe(employerData.house_number);
    expect(response.body.street).toBe(employerData.street);
    expect(response.body.city).toBe(employerData.city);
    expect(response.body.barangay).toBe(employerData.barangay);
    expect(response.body.verification_status).toBe("pending");

    expect(response.body).not.toHaveProperty("password");

    //Verify data is saved in the database
    const savedEmployer = await Employer.findById(response.body._id);
    expect(savedEmployer).not.toBeNull();
    expect(savedEmployer.first_name).toBe(employerData.first_name);
    expect(savedEmployer.middle_name).toBe(employerData.middle_name);
    expect(savedEmployer.last_name).toBe(employerData.last_name);
    expect(savedEmployer.email_address).toBe(employerData.email_address);

    expect(savedEmployer.house_number).toBe(employerData.house_number);
    expect(savedEmployer.street).toBe(employerData.street);
    expect(savedEmployer.city).toBe(employerData.city);
    expect(savedEmployer.barangay).toBe(employerData.barangay);
    expect(savedEmployer.verification_status).toBe("pending");

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
