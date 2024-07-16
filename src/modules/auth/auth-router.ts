import Router from "express-promise-router";
import { AuthController } from "./auth-controller";
import { withoutAuthMiddleware } from "../../middlewares/without-auth-middleware";

const authController = new AuthController();
const authRouter = Router();

authRouter.post("/auth/signup", withoutAuthMiddleware, authController.signup);
authRouter.post("/auth/login", withoutAuthMiddleware, authController.login);

export { authRouter };
