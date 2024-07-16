import { compare } from "bcrypt";
import { z } from "zod";
import { ClientError } from "../../../errors/client-error";
import { prisma } from "../../../lib/prisma";

const loginDataSchema = z.object({
  email: z.string().email("Invalid e-mail."),
  password: z.string().min(8, "Password must be at least 8 characters long.")
});

export class LoginService {
  async execute(data: unknown) {
    const loginData = loginDataSchema.parse(data);
    const user = await prisma.user.findUnique({
      where: { email: loginData.email }
    });

    if (!user) throw new ClientError("Invalid email or password.");

    const isCorrectPassword = await compare(loginData.password, user.password);

    if (!isCorrectPassword) throw new ClientError("Invalid email or password.");

    return user.id;
  }
}
