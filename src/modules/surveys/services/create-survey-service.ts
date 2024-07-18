import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { Choice } from "@prisma/client";

const surveyDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  author_id: z.string().uuid(),
  questions: z
    .array(
      z.object({
        title: z.string(),
        choices: z
          .array(
            z.object({
              title: z.string()
            })
          )
          .min(2, "Questions must have at least 2 options.")
      })
    )
    .min(1, "Survey must have at least one question.")
});

export class CreateSurveyService {
  async execute(data: unknown) {
    const surveyData = surveyDataSchema.parse(data);
    const survey = await prisma.survey.create({
      data: {
        title: surveyData.title,
        description: surveyData.description,
        author_id: surveyData.author_id,
        questions: {
          createMany: {
            data: surveyData.questions.map(q => ({
              title: q.title
            }))
          }
        }
      },
      select: {
        id: true,
        questions: true
      }
    });
    let choices: Omit<Choice, "id">[] = [];

    survey.questions.forEach((q, i) => {
      choices = [
        ...choices,
        ...surveyData.questions[i].choices.map(c => ({
          title: c.title,
          question_id: q.id
        }))
      ];
    });

    await prisma.choice.createMany({ data: choices });
    return survey.id;
  }
}
