import { AuthorizationError } from "../errors/authorization-error";

export function validatePermissions(req: any, targetPermission: string) {
  const permissions: string[] = req.userPermissions;
  const hasPermission = permissions.find(p => p == targetPermission);
  if (!hasPermission) throw new AuthorizationError();
}
