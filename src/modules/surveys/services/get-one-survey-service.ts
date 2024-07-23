import { ClientError } from "../../../errors/client-error";
import { prisma } from "../../../lib/prisma";
import { uuidSchema } from "../../../lib/uuid-schema";

export class GetOneSurveyService {
  async execute(surveyID: string, userID: string) {
    uuidSchema.parse(surveyID);
    uuidSchema.parse(userID);
    const survey = await prisma.survey.findUnique({
      where: { id: surveyID },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        completed_at: true,
        author_id: true,
        questions: {
          select: {
            id: true,
            title: true,
            choices: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    if (!survey) throw new ClientError("Survey not found.");

    const userAnswers = await prisma.answer.findMany({
      where: { respondant_id: userID, survey_id: surveyID }
    });
    return { survey, userAnswers };
  }
}
