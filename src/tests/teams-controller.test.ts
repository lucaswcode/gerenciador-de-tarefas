import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("TeamController", () => {
  let token: string;
  let teamId: string;

  beforeAll(async () => {
    const sessionResponse = await request(app).post("/sessions").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(sessionResponse.status).toBe(200);
    token = sessionResponse.body.token;
  });

  afterAll(async () => {
    await prisma.team.deleteMany({
      where: {
        id: teamId,
      },
    });
  });

  it("Should create a team", async () => {
    const response = await request(app)
      .post("/teams")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Support",
        description: "Equipe focada em dar suporte aos clientes.",
      });

    expect(response.status).toBe(201);

    const team = await prisma.team.findFirst({
      where: { name: "Support" },
    });

    teamId = team!.id;
  });

  it("Should return 401 without authentication", async () => {
    const response = await request(app).post("/teams").send({
      name: "Unauthorized Team",
    });

    expect(response.status).toBe(401);
  });
});
