import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

export class TeamsMembersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.uuid(),
      team_id: z.uuid(),
    });

    const { user_id, team_id } = bodySchema.parse(request.body);

    const memberAlreadyExists = await prisma.teamMember.findFirst({
      where: {
        userId: user_id,
        teamId: team_id,
      },
    });

    if (memberAlreadyExists) {
      throw new AppError("User is already a member of this team", 409);
    }

    await prisma.teamMember.create({
      data: {
        userId: user_id,
        teamId: team_id,
      },
    });

    return response.status(201).json();
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.uuid(),
    });

    const { team_id } = paramsSchema.parse(request.params);

    const teamMember = await prisma.team.findUnique({
      where: {
        id: team_id,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!teamMember) {
      throw new AppError("Team not found", 404);
    }

    return response.json(teamMember.members.map((member) => member.user));
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      user_id: z.uuid(),
      team_id: z.uuid(),
    });

    const { team_id, user_id } = paramsSchema.parse(request.params);

    const member = await prisma.teamMember.findFirst({
      where: { teamId: team_id, userId: user_id },
    });

    if (!member) {
      throw new AppError("member not found", 404);
    }

    await prisma.teamMember.delete({
      where: {
        id: member.id,
      },
    });

    return response.json();
  }
}
