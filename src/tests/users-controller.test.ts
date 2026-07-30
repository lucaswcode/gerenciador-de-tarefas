import { afterAll, describe, expect, it } from "@jest/globals";
import { prisma } from "@/database/prisma";
import request from "supertest";
import { app } from "@/app";

describe("UsersController", () => {
  let user_id: string;

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: user_id } });
  });

  it("Should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "testuser@email.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test User");

    user_id = response.body.id;
  });

  it("Should throw an error if user with same email already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "Duplicate User",
      email: "testuser@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("user with same email already exists");
  });

  it("Should throw a validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "invalid-email",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("validation error");
  });
});
