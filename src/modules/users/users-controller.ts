import { Request, Response } from "express";
import { Permission } from "@prisma/client";
import { AuthorizationError } from "../../errors/authorization-error";
import { CreateUserService } from "./services/create-user-service";
import { GetUserProfileService } from "./services/get-user-profile-service";
import { DeleteUserService } from "./services/delete-user-service";

export class UsersController {
  createUser = async (req: Request, res: Response) => {
    const permissions: Permission[] = (req as any).userPermissions;
    const createUserPermission = permissions.find(
      p => p.action == "create-user"
    );

    if (!createUserPermission) throw new AuthorizationError();

    const data = req.body;
    const userID = await new CreateUserService().execute(data);
    res.json({ message: "User successfully created.", data: { userID } });
  };

  getProfile = async (req: Request, res: Response) => {
    const userID: string = (req as any).userID;
    const profile = await new GetUserProfileService().execute(userID);
    res.json({ data: profile });
  };

  deleteUser = async (req: Request, res: Response) => {
    const userID: string = (req as any).userID;
    await new DeleteUserService().execute(userID);
    res.json({ message: "User successfully deleted." });
  };
}
