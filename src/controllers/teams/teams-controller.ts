import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { z } from "zod";

export class TeamController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
    });

    const { name, description } = bodySchema.parse(request.body);

    await prisma.team.create({
      data: {
        name,
        description,
      },
    });

    return response.json({ message: "TeamsController: OK" });
  }

  async index(request: Request, response: Response) {
    const teams = await prisma.team.findMany();

    return response.json(teams);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const bodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { name, description } = bodySchema.parse(request.body);

    await prisma.team.update({
      data: {
        name,
        description,
      },
      where: {
        id,
      },
    });

    return response.json();
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.team.delete({ where: { id } });
    return response.json({ message: "TeamController: Delete" });
  }
}
