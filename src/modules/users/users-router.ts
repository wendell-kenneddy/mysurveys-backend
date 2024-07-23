import Router from "express-promise-router";
import { UsersController } from "./users-controller";
import { withAuthMiddleware } from "../../middlewares/with-auth-middleware";
import { roleAndPermissionsMiddleware } from "../../middlewares/role-and-permissions-middleware";

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.post(
  "/users",
  withAuthMiddleware,
  roleAndPermissionsMiddleware,
  usersController.createUser
);
usersRouter.get(
  "/users/profile",
  withAuthMiddleware,
  usersController.getProfile
);
usersRouter.delete(
  "/users/profile",
  withAuthMiddleware,
  roleAndPermissionsMiddleware,
  usersController.deleteUser
);

export { usersRouter };
