import Router from "express-promise-router";
import { UsersController } from "./users-controller";
import { withAuthMiddleware } from "../../middlewares/with-auth-middleware";

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.post("/users", withAuthMiddleware, usersController.createUser);
usersRouter.get(
  "/users/profile",
  withAuthMiddleware,
  usersController.getProfile
);
usersRouter.delete(
  "/users/profile",
  withAuthMiddleware,
  usersController.deleteUser
);

export { usersRouter };
