import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { hash } from "bcrypt";
import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("TasksHistoryController", () => {
  let token: string;
  let userId: string;
  let teamId: string;
  let taskId: string;

  beforeAll(async () => {
    const email = `history-user-${Date.now()}@example.com`;
    const password = "password123";

    const user = await prisma.user.create({
      data: {
        name: "History User",
        email,
        password: await hash(password, 8),
      },
    });

    const team = await prisma.team.create({
      data: {
        name: `History Team ${Date.now()}`,
        description: "Equipe criada para teste de histórico.",
      },
    });

    const sessionResponse = await request(app).post("/sessions").send({
      email,
      password,
    });

    expect(sessionResponse.status).toBe(200);

    token = sessionResponse.body.token;
    userId = user.id;
    teamId = team.id;
  });

  afterAll(async () => {
    await prisma.taskHistory.deleteMany({
      where: {
        taskId,
      },
    });

    await prisma.task.deleteMany({
      where: {
        id: taskId,
      },
    });

    await prisma.team.deleteMany({
      where: {
        id: teamId,
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: userId,
      },
    });
  });

  it("Should list task history after updating its status", async () => {
    const createdTaskResponse = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Implementar histórico",
        description: "Criar o fluxo de histórico de tarefas.",
        status: "pending",
        priority: "medium",
        assigned_to: userId,
        team_id: teamId,
      });

    expect(createdTaskResponse.status).toBe(201);

    const createdTask = await prisma.task.findFirst({
      where: {
        title: "Implementar histórico",
      },
    });

    expect(createdTask).not.toBeNull();
    taskId = createdTask!.id;

    const updateResponse = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "in_progress",
      });

    expect(updateResponse.status).toBe(204);

    const historyResponse = await request(app)
      .get(`/tasks/history/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(historyResponse.status).toBe(200);
    expect(historyResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          taskId,
          oldStatus: "pending",
          newStatus: "in_progress",
          changedBy: userId,
        }),
      ]),
    );
  });
});
