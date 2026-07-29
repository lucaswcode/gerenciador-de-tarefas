import { Router } from "express";

import { TeamsMembersController } from "@/controllers/teams/teams-members-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const teamsMembersRoutes = Router();
const teamsMembersController = new TeamsMembersController();

teamsMembersRoutes.use(ensureAuthenticated);

teamsMembersRoutes.post(
  "/:team_id/members",
  verifyUserAuthorization(["admin"]),
  teamsMembersController.create,
);
teamsMembersRoutes.get("/:team_id/members", teamsMembersController.show);

teamsMembersRoutes.delete(
  "/:team_id/members/:user_id",
  verifyUserAuthorization(["admin"]),
  teamsMembersController.delete,
);

export { teamsMembersRoutes };
