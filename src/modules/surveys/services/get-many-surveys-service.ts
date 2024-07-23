import { prisma } from "../../../lib/prisma";
import { queryPageSchema } from "../../../lib/query-page-schema";

export class GetManySurveysService {
  async execute(data: unknown) {
    const queryPage = queryPageSchema.parse(data);
    const surveys = await prisma.survey.findMany({
      skip: queryPage.offset,
      take: queryPage.size,
      select: {
        id: true,
        title: true,
        description: true,
        completed_at: true,
        created_at: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });
    return surveys;
  }
}
