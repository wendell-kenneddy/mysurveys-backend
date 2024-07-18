import { prisma } from "../../../lib/prisma";
import { uuidSchema } from "../../../lib/uuid-schema";

export class CompleteSurveyService {
  async execute(id: string) {
    uuidSchema.parse(id);
    await prisma.survey.update({
      where: { id },
      data: {
        completed_at: new Date()
      }
    });
  }
}
