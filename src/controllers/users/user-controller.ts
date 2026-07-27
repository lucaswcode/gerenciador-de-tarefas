import { Request, Response } from "express";
import { prisma } from "@/database/prisma";

export class UsersControllers {
  create(request: Request, response: Response) {
    return response.json({ message: "UsersControllers: Create" });
  }
}
