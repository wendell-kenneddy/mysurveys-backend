import { prisma } from "../../../lib/prisma";
import { uuidSchema } from "../../../lib/uuid-schema";

export class GetOneSurveyService {
  async execute(id: string) {
    uuidSchema.parse(id);
    const survey = await prisma.survey.findUnique({
      where: { id },
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
    return survey;
  }
}
