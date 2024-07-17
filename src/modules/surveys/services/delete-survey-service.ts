import { prisma } from "../../../lib/prisma";
import { uuidSchema } from "../../../lib/uuid-schema";

export class DeleteSurveyService {
  async execute(id: string) {
    uuidSchema.parse(id);
    await prisma.survey.delete({
      where: { id }
    });
  }
}
