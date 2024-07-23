import { ClientError } from "../../../errors/client-error";
import { prisma } from "../../../lib/prisma";
import { uuidSchema } from "../../../lib/uuid-schema";

export class GetUserProfileService {
  async execute(userID: string) {
    uuidSchema.parse(userID);

    const profile = await prisma.user.findUnique({
      where: { id: userID },
      select: {
        name: true,
        email: true,
        role: {
          select: { title: true }
        },
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

    if (!profile) throw new ClientError("User not found.");

    return profile;
  }
}
