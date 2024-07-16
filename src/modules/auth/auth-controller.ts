import { Request, Response } from "express";
import { SignupService } from "./services/signup-service";
import { JWTHandler } from "../../lib/jwt-handler";
import { LoginService } from "./services/login-service";

export class AuthController {
  signup = async (req: Request, res: Response) => {
    const data = req.body;
    const userID = await new SignupService().execute(data);
    const { accessToken, refreshToken } = this.generateAccessAndRefreshTokens(
      userID
    );
    this.setTokensIntoResponse(accessToken, refreshToken, res);
    return res.json({ userID });
  };

  login = async (req: Request, res: Response) => {
    const data = req.body;
    const userID = await new LoginService().execute(data);
    const { accessToken, refreshToken } = this.generateAccessAndRefreshTokens(
      userID
    );
    this.setTokensIntoResponse(accessToken, refreshToken, res);
    return res.json({ userID });
  };

  private generateAccessAndRefreshTokens(userID: string) {
    const accessToken = JWTHandler.generateAccessToken(userID);
    const refreshToken = JWTHandler.generateRefreshToken(userID);
    return { accessToken, refreshToken };
  }

  private setTokensIntoResponse(
    accessToken: string,
    refreshToken: string,
    res: Response
  ) {
    res.setHeader("Authorization", accessToken);
    res.cookie("refresh-token", refreshToken, { signed: true });
  }
}
