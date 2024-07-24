import { hash } from "bcrypt";
import { prisma } from "./prisma";

const permissionsToCreate = [
  { action: "view-survey" },
  { action: "create-survey" },
  { action: "complete-survey" },
  { action: "delete-survey" },
  { action: "respond-survey" },
  { action: "view-stats" },
  { action: "create-user" },
  { action: "delete-user" }
];

async function main() {
  const permissions = await prisma.permission.createManyAndReturn({
    data: permissionsToCreate
  });

  const coordinatorRole = await prisma.role.create({
    data: {
      title: "coordinator",
      permissions: {
        connect: permissions.filter(
          ({ action }) => action != "delete-user" && action != "create-user"
        )
      }
    }
  });

  const respondantRole = await prisma.role.create({
    data: {
      title: "respondant",
      permissions: {
        connect: permissions.filter(
          ({ action }) => action == "view-survey" || action == "respond-survey"
        )
      }
    }
  });

  const adminRole = await prisma.role.create({
    data: {
      title: "admin",
      permissions: { connect: permissions }
    }
  });

  const password = await hash("12345678", 10);
  await prisma.user.createMany({
    data: [
      {
        name: "John Doe",
        email: "johndoe@email.com",
        password,
        role_id: adminRole.id
      },
      {
        name: "Mary Doe",
        email: "marydoe@email.com",
        password,
        role_id: coordinatorRole.id
      },
      {
        name: "Jimmy",
        email: "jimmy@email.com",
        password,
        role_id: respondantRole.id
      }
    ]
  });
}

main();
