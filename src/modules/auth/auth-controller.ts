import { Request, Response } from "express";
import { SignupService } from "./services/signup-service";
import { JWTHandler } from "../../lib/jwt-handler";
import { LoginService } from "./services/login-service";

export class AuthController {
  signup = async (req: Request, res: Response) => {
    const data = req.body;
    const user = await new SignupService().execute(data);
    const { accessToken, refreshToken } = this.generateAccessAndRefreshTokens(
      user
    );
    this.setTokensIntoResponse(accessToken, refreshToken, res);
    return res.json({ id: user.id });
  };

  login = async (req: Request, res: Response) => {
    const data = req.body;
    const user = await new LoginService().execute(data);
    const { accessToken, refreshToken } = this.generateAccessAndRefreshTokens(
      user
    );
    this.setTokensIntoResponse(accessToken, refreshToken, res);
    return res.json({ id: user.id });
  };

  private generateAccessAndRefreshTokens(user: unknown) {
    const accessToken = JWTHandler.generateAccessToken(user);
    const refreshToken = JWTHandler.generateRefreshToken(user);
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
