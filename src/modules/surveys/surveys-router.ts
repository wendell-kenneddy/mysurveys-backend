import Router from "express-promise-router";
import { SurveysController } from "./surveys-controller";
import { withAuthMiddleware } from "../../middlewares/with-auth-middleware";

const surveysController = new SurveysController();
const surveysRouter = Router();

surveysRouter.get(
  "/surveys/:surveyID",
  withAuthMiddleware,
  surveysController.getOneSurvey
);
surveysRouter.get(
  "/surveys",
  withAuthMiddleware,
  surveysController.getManySurveys
);
surveysRouter.post(
  "/surveys",
  withAuthMiddleware,
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
  surveysController.deleteSurvey
);
surveysRouter.patch(
  "/surveys/:surveyID",
  withAuthMiddleware,
  surveysController.completeSurvey
);
surveysRouter.get(
  "/surveys/:surveyID/stats",
  withAuthMiddleware,
  surveysController.getStats
);

export { surveysRouter };
