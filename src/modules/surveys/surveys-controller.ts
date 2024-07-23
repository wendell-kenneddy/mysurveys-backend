import { Request, Response } from "express";
import { AuthorizationError } from "../../errors/authorization-error";
import { ClientError } from "../../errors/client-error";
import { validatePermissions } from "../../lib/validate-permissions";
import { CompleteSurveyService } from "./services/complete-survey-service";
import { CreateSurveyService } from "./services/create-survey-service";
import { DeleteSurveyService } from "./services/delete-survey-service";
import { GetManySurveysService } from "./services/get-many-surveys-service";
import { GetOneSurveyService } from "./services/get-one-survey-service";
import { AnswerSurveyService } from "./services/answer-survey-service";
import { GetSurveyStatsService } from "./services/get-survey-stats-service";

export class SurveysController {
  createSurvey = async (req: Request, res: Response) => {
    validatePermissions(req, "create-survey");
    const userID: string = (req as any).userID;
    const surveyID = await new CreateSurveyService().execute({
      author_id: userID,
      ...req.body
    });
    return res.json({
      message: "Survey successfully created.",
      data: { surveyID }
    });
  };

  answerSurvey = async (req: Request, res: Response) => {
    const userID: string = (req as any).userID;
    const surveyID = req.params.surveyID;
    await new AnswerSurveyService().execute({
      respondant_id: userID,
      survey_id: surveyID,
      answers: req.body
    });
    return res.json({ message: "Survey successfully answered." });
  };

  getOneSurvey = async (req: Request, res: Response) => {
    validatePermissions(req, "view-survey");
    const userID = (req as any).userID;
    const surveyID = req.params.surveyID;
    const survey = await new GetOneSurveyService().execute(surveyID, userID);
    return res.json({ data: survey });
  };

  getManySurveys = async (req: Request, res: Response) => {
    validatePermissions(req, "view-survey");
    const surveys = await new GetManySurveysService().execute(req.body);
    return res.json({ data: surveys });
  };

  completeSurvey = async (req: Request, res: Response) => {
    validatePermissions(req, "complete-survey");

    const userID: string = (req as any).userID;
    const userRole: string = (req as any).userRole;
    const surveyID = req.params.surveyID;
    const response = await new GetOneSurveyService().execute(surveyID, userID);

    if (!response) throw new ClientError("Survey not found.");
    if (userRole != "admin" && userID != response.survey.author_id) {
      throw new AuthorizationError();
    }
    await new CompleteSurveyService().execute(surveyID);

    return res.json({ message: "Survey successfully completed." });
  };

  deleteSurvey = async (req: Request, res: Response) => {
    validatePermissions(req, "delete-survey");

    const userID: string = (req as any).userID;
    const userRole: string = (req as any).userRole;
    const surveyID = req.params.surveyID;
    const response = await new GetOneSurveyService().execute(surveyID, userID);

    if (!response) throw new ClientError("Survey not found.");
    if (userRole != "admin" && userID != response.survey.author_id) {
      throw new AuthorizationError();
    }
    await new DeleteSurveyService().execute(surveyID);

    return res.json({ message: "Survey successfully deleted." });
  };

  getStats = async (req: Request, res: Response) => {
    validatePermissions(req, "view-stats");
    const userID: string = (req as any).userID;
    const userRole: string = (req as any).userRole;
    const surveyID = req.params.surveyID;
    const stats = await new GetSurveyStatsService().execute(surveyID);

    if (userRole != "admin" && userID != stats.author_id) {
      throw new AuthorizationError();
    }

    return res.json({ data: stats });
  };
}
