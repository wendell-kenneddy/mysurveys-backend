import { Permission } from "@prisma/client";
import { AuthorizationError } from "../errors/authorization-error";

export function validatePermissions(req: any, targetPermission: string) {
  const permissions: Permission[] = req.userPermissions;
  const hasPermission = permissions.find(p => p.action == targetPermission);
  if (!hasPermission) throw new AuthorizationError();
}
