import { sign } from "jsonwebtoken";
import { env } from "./env";

export class JWTHandler {
  static generateAccessToken(userID: string) {
    const token = sign({ userID }, env.ACCESS_TOKEN_SECRET, {
      subject: "access-token",
      expiresIn: "1h"
    });
    return token;
  }

  static generateRefreshToken(userID: string) {
    const token = sign({ userID }, env.REFRESH_TOKEN_SECRET, {
      subject: "refresh-token",
      expiresIn: "12h"
    });
    return token;
  }
}
