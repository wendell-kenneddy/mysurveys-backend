import { sign } from "jsonwebtoken";
import { env } from "./env";
import { z } from "zod";

const tokenDataSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  role: z.string(),
  permissions: z.array(z.string())
});

export class JWTHandler {
  static generateAccessToken(data: unknown) {
    const userData = tokenDataSchema.parse(data);
    const token = sign({ ...userData }, env.ACCESS_TOKEN_SECRET, {
      subject: "access-token",
      expiresIn: "1h"
    });
    return token;
  }

  static generateRefreshToken(data: unknown) {
    const userData = tokenDataSchema.parse(data);
    const token = sign({ ...userData }, env.REFRESH_TOKEN_SECRET, {
      subject: "refresh-token",
      expiresIn: "6h"
    });
    return token;
  }
}
