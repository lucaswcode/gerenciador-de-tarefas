import { Router } from "express";
import { TasksHistoryController } from "@/controllers/tasks/tasks-history-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const tasksHistoryRoutes = Router();
const tasksHistoryController = new TasksHistoryController();

tasksHistoryRoutes.use(ensureAuthenticated);

tasksHistoryRoutes.use("/history/:task_id", tasksHistoryController.index);

export { tasksHistoryRoutes };
