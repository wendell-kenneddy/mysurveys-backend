import { ClientError } from "../../../errors/client-error";
import { prisma } from "../../../lib/prisma";
import { uuidSchema } from "../../../lib/uuid-schema";

export class GetSurveyStatsService {
  async execute(surveyID: string) {
    uuidSchema.parse(surveyID);

    const survey = await prisma.survey.findUnique({
      where: { id: surveyID },
      select: {
        completed_at: true,
        author_id: true,
        answers: true,
        _count: {
          select: {
            respondants: true
          }
        }
      }
    });

    if (!survey) throw new ClientError("Survey not found.");
    if (!survey.completed_at) throw new ClientError("Survey not completed.");
    if (!survey.answers.length) throw new ClientError("Survey has no answers.");

    const frequency = survey.answers.reduce<Record<string, number>>(
      (acc, curr) => {
        const questionChoiceTotalKey = `${curr.question_title}:${curr.choice_title}`;
        const questionChoiceTotalValue = acc[questionChoiceTotalKey];

        acc[questionChoiceTotalKey] = questionChoiceTotalValue
          ? questionChoiceTotalValue + 1
          : 1;

        return acc;
      },
      {}
    );

    return {
      frequency,
      author_id: survey.author_id,
      respondantsTotal: survey._count.respondants
    };
  }
}
