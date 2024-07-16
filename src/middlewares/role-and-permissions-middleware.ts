import { NextFunction, Request, Response } from "express";
import { ClientError } from "../errors/client-error";
import { prisma } from "../lib/prisma";

export async function roleAndPermissionsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userID: string = (req as any).userID;
  const user = await prisma.user.findUnique({
    where: { id: userID },
    select: {
      role: {
        select: { title: true, permissions: true }
      }
    }
  });

  if (!user) throw new ClientError("User not found.");

  (req as any).userRole = user.role.title;
  (req as any).userPermissions = user.role.permissions;

  next();
}
