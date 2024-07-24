import { z } from "zod";
import { hashPassword } from "../../../lib/hashPassword";
import { prisma } from "../../../lib/prisma";

const newUserSchema = z.object({
  name: z.string(),
  email: z.string().email("Invalid e-mail."),
  password: z.string().min(8, "Password must be at least 8 characters long.")
});

export class SignupService {
  async execute(data: unknown) {
    const newUserData = newUserSchema.parse(data);
    const hashedPassword = await hashPassword(newUserData.password);
    const respondantRole = await prisma.role.findFirst({
      where: { title: "respondant" },
      select: { id: true }
    });

    if (!respondantRole) throw new Error("Respondant role not found.");

    const newUser = await prisma.user.create({
      data: {
        name: newUserData.name,
        email: newUserData.email,
        password: hashedPassword,
        role_id: respondantRole.id
      },
      select: {
        id: true,
        name: true,
        role: {
          select: {
            title: true,
            permissions: {
              select: { action: true }
            }
          }
        }
      }
    });

    return {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role.title,
      permissions: newUser.role.permissions.map(p => p.action)
    };
  }
}
