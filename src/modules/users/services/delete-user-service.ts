import { ClientError } from "../../../errors/client-error";
import { prisma } from "../../../lib/prisma";
import { uuidSchema } from "../../../lib/uuid-schema";

export class DeleteUserService {
  async execute(userID: string) {
    uuidSchema.parse(userID);

    const deletedUser = await prisma.user.delete({ where: { id: userID } });

    if (!deletedUser) throw new ClientError("User not found.");
  }
}
