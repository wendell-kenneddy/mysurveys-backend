import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { Permission } from "@prisma/client";
import { AuthorizationError } from "../../errors/authorization-error";
import { CreateUserService } from "./services/create-user-service";

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
    const profile = await prisma.user.findUnique({
      where: { id: userID },
      select: {
        name: true,
        email: true,
        responded_surveys: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    res.json({ data: profile });
  };
}
