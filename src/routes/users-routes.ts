import { Router } from "express";

import { UsersControllers } from "@/controllers/users/user-controller";

const usersRoutes = Router();

const usersControllers = new UsersControllers();

usersRoutes.post("/", usersControllers.create);

export { usersRoutes };
