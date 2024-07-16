import { z } from "zod";
import { ClientError } from "../../../errors/client-error";
import { hashPassword } from "../../../lib/hashPassword";
import { prisma } from "../../../lib/prisma";

const newUserDataSchema = z.object({
  name: z.string(),
  email: z.string().email("Invalid e-mail"),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  role_id: z.string()
});

export class CreateUserService {
  async execute(data: unknown) {
    const { name, email, password, role_id } = newUserDataSchema.parse(data);
    const hashedPassword = await hashPassword(password);
    const role = await prisma.role.findUnique({ where: { id: role_id } });

    if (!role) throw new ClientError("Role not found.");

    const userID = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role_id
      },
      select: { id: true }
    });
    return userID;
  }
}
