import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamsRoutes } from "./teams-routes";
import { tasksRoutes } from "./tasks-routes";
import { teamsMembersRoutes } from "./teams-members-routes";
import { tasksHistoryRoutes } from "./tasks-history-routes";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/teams", teamsRoutes);
routes.use("/tasks", tasksRoutes);
routes.use("/teams", teamsMembersRoutes);
routes.use("/tasks", tasksHistoryRoutes);

export { routes };
