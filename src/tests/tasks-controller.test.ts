import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { hash } from "bcrypt";
import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("TasksController", () => {
  let token: string;
  let assigneeId: string;
  let teamId: string;

  beforeAll(async () => {
    const email = `task-user-${Date.now()}@example.com`;
    const password = "password123";

    const user = await prisma.user.create({
      data: {
        name: "Task Creator",
        email,
        password: await hash(password, 8),
      },
    });

    const team = await prisma.team.create({
      data: {
        name: `Task Team ${Date.now()}`,
        description: "Equipe criada para teste de tarefa.",
      },
    });

    const sessionResponse = await request(app).post("/sessions").send({
      email,
      password,
    });

    expect(sessionResponse.status).toBe(200);

    token = sessionResponse.body.token;
    assigneeId = user.id;
    teamId = team.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany({
      where: {
        title: "Implementar fluxo de login",
      },
    });

    await prisma.team.deleteMany({
      where: {
        id: teamId,
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: assigneeId,
      },
    });
  });

  it("Should create a task", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Implementar fluxo de login",
        description: "Criar a tela de autenticação e o fluxo de backend.",
        status: "pending",
        priority: "high",
        assigned_to: assigneeId,
        team_id: teamId,
      });

    expect(response.status).toBe(201);

    const task = await prisma.task.findFirst({
      where: {
        title: "Implementar fluxo de login",
      },
    });

    expect(task).not.toBeNull();
    expect(task?.assignedTo).toBe(assigneeId);
    expect(task?.teamId).toBe(teamId);
  });

  it("Should return 401 without authentication", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Tarefa sem auth",
      status: "pending",
      priority: "high",
      assigned_to: assigneeId,
      team_id: teamId,
    });

    expect(response.status).toBe(401);
  });
});
