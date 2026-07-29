import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

export class TasksHistoryController {
  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      task_id: z.uuid(),
    });

    const { task_id } = paramsSchema.parse(request.params);

    const history = await prisma.taskHistory.findMany({
      where: {
        taskId: task_id,
      },
      orderBy: { changedAt: "desc" },
    });

    return response.json(history);
  }
}
