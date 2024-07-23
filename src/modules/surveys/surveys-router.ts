import Router from "express-promise-router";
import { SurveysController } from "./surveys-controller";
import { withAuthMiddleware } from "../../middlewares/with-auth-middleware";
import { roleAndPermissionsMiddleware } from "../../middlewares/role-and-permissions-middleware";

const surveysController = new SurveysController();
const surveysRouter = Router();

surveysRouter.get(
  "/surveys/:surveyID",
  withAuthMiddleware,
  roleAndPermissionsMiddleware,
  surveysController.getOneSurvey
);
surveysRouter.get(
  "/surveys",
  withAuthMiddleware,
  roleAndPermissionsMiddleware,
  surveysController.getManySurveys
);
surveysRouter.post(
  "/surveys",
  withAuthMiddleware,
  roleAndPermissionsMiddleware,
  surveysController.createSurvey
);
surveysRouter.post(
  "/surveys/:surveyID/answers",
  withAuthMiddleware,
  surveysController.answerSurvey
);
surveysRouter.delete(
  "/surveys/:surveyID",
  withAuthMiddleware,
  roleAndPermissionsMiddleware,
  surveysController.deleteSurvey
);
surveysRouter.patch(
  "/surveys/:surveyID",
  withAuthMiddleware,
  roleAndPermissionsMiddleware,
  surveysController.completeSurvey
);
surveysRouter.get(
  "/surveys/:surveyID/stats",
  withAuthMiddleware,
  roleAndPermissionsMiddleware,
  surveysController.getStats
);

export { surveysRouter };
