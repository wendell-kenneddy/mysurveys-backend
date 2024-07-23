import { ClientError } from "../../../errors/client-error";
import { prisma } from "../../../lib/prisma";
import { uuidSchema } from "../../../lib/uuid-schema";

export class GetRespondedSurveysService {
  async execute(userID: string) {
    uuidSchema.parse(userID);
    const user = await prisma.user.findUnique({
      where: { id: userID },
      select: {
        responded_surveys: {
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
        }
      }
    });

    if (!user) throw new ClientError("User not found.");

    return user.responded_surveys;
  }
}
