import { hash } from "bcrypt";

export async function hashPassword(pass: string) {
  const hashedPwd = await hash(pass, 10);
  return hashedPwd;
}
