import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod";

export class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string(),
      description: z.string().optional(),
      status: z.enum(["pending", "in_progress", "completed"]),
      priority: z.enum(["high", "medium", "low"]),
      assigned_to: z.uuid(),
      team_id: z.uuid(),
    });

    const { title, description, status, priority, assigned_to, team_id } =
      bodySchema.parse(request.body);

    await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        assignedTo: assigned_to,
        teamId: team_id,
      },
    });

    return response.status(201).json();
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
    });

    const { status, priority } = querySchema.parse(request.query);

    const tasks = await prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
      },
      include: {
        assignee: { select: { name: true, email: true } },
      },
    });

    return response.json(tasks);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const bodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { title, description, status, priority } = bodySchema.parse(
      request.body,
    );

    await prisma.task.update({
      data: {
        title,
        description,
        status,
        priority,
      },
      where: { id },
    });
    return response.status(204).json();
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const task = await prisma.task.findFirst({
      where: { id: id },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    await prisma.task.delete({
      where: { id },
    });
    return response.json({ message: "Tasks: Delete" });
  }
}
