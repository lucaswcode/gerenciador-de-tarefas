import request from "supertest";
import { afterAll, describe, expect, it } from "@jest/globals";

import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("SessionsController", () => {
  let user_id: string;

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: user_id },
    });
  });

  it("Should authenticate and get an access token", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Auth Test User",
      email: "auth_test_user@example.com",
      password: "password123",
    });

    user_id = userResponse.body.id;

    const sessionResponse = await request(app).post("/sessions").send({
      email: "auth_test_user@example.com",
      password: "password123",
    });

    expect(sessionResponse.status).toBe(200);
    expect(sessionResponse.body.token).toEqual(expect.any(String));
  });

  it("Should return 401 for invalid credentials", async () => {
    const response = await request(app).post("/sessions").send({
      email: "auth_test_user@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("invalid email or password");
  });
});
