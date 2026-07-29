import { Router } from "express";

import { TeamController } from "@/controllers/teams/teams-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const teamsRoutes = Router();
const teamsController = new TeamController();
teamsRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]));
teamsRoutes.post("/", teamsController.create);
teamsRoutes.get("/", teamsController.index);
teamsRoutes.put("/edit-teams/:id", teamsController.update);
teamsRoutes.delete("/:id", teamsController.delete);

export { teamsRoutes };
