import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify, VerifyErrors } from "jsonwebtoken";
import { AuthenticationError } from "../errors/authentication-error";
import { env } from "../lib/env";
import { JWTHandler } from "../lib/jwt-handler";

export function withAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    throw new AuthenticationError("Unauthenticated access denied.");
  }

  const acessToken = authorizationHeader.split(" ")[1];
  verify(acessToken, env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      console.log(err);

      if (err.message == "jwt malformed" || err.message == "invalid jwt") {
        throw new AuthenticationError("Invalid Access Token provided.");
      }

      if (err.message == "jwt expired") {
        const refreshToken = req.cookies["refresh-token"];
        if (!refreshToken)
          throw new AuthenticationError("No Refresh Token provided.");

        verify(
          refreshToken,
          env.REFRESH_TOKEN_SECRET,
          (e: unknown, p: unknown) => {
            if (e) {
              if ((e as VerifyErrors).message == "jwt expired") {
                throw new AuthenticationError("Refresh Token expired.");
              }

              if (
                (e as VerifyErrors).message == "jwt malformed" ||
                (e as VerifyErrors).message == "invalid jwt"
              ) {
                throw new AuthenticationError("Invalid Refresh Token.");
              }
            }

            const refreshTokenPayload = p as JwtPayload;
            const id = refreshTokenPayload.userID as string;
            const name = refreshTokenPayload.userName as string;
            const role = refreshTokenPayload.userRole as string;
            const permissions = refreshTokenPayload.userPermissions as string[];
            const newAccessToken = JWTHandler.generateAccessToken({
              id,
              name,
              role,
              permissions
            });
            res.setHeader("Authorization", newAccessToken);
            return res
              .status(200)
              .json({ message: "New Access Token provided." });
          }
        );
      }

      throw new Error(err.message);
    }

    (req as any).userID = (payload as JwtPayload).id;
    (req as any).userName = (payload as JwtPayload).name;
    (req as any).userRole = (payload as JwtPayload).role;
    (req as any).userPermissions = (payload as JwtPayload).permissions;
  });

  next();
}
