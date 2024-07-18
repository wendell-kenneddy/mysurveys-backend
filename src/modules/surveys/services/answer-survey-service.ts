import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { ClientError } from "../../../errors/client-error";

const surveyAnswersSchema = z.object({
  respondant_id: z.string().uuid(),
  survey_id: z.string().uuid(),
  answers: z
    .array(
      z.object({
        question_title: z.string(),
        choice_title: z.string()
      })
    )
    .min(1, "At least one answer must be provided.")
});

export class AnswerSurveyService {
  async execute(data: unknown) {
    const surveyAnswers = surveyAnswersSchema.parse(data);
    const survey = await prisma.survey.findUnique({
      where: { id: surveyAnswers.survey_id },
      select: {
        id: true,
        completed_at: true,
        _count: {
          select: { questions: true }
        }
      }
    });

    if (!survey) throw new ClientError("Survey not found.");
    if (survey.completed_at)
      throw new ClientError("Survey has already been completed.");
    if (surveyAnswers.answers.length != survey._count.questions)
      throw new ClientError("Not enough answers provided.");

    await prisma.answer.createMany({
      data: surveyAnswers.answers.map(a => ({
        ...a,
        survey_id: surveyAnswers.survey_id,
        respondant_id: surveyAnswers.respondant_id
      }))
    });
    await prisma.user.update({
      where: { id: surveyAnswers.respondant_id },
      data: {
        responded_surveys: {
          connect: {
            id: survey.id
          }
        }
      }
    });
  }
}
