import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {

  const departments = [
"INFORMATIQUE",

];

for (const department of departments) {
  await prisma.department.upsert({
    where: { name: department },
    update: {},
    create: { name: department },
  });
}

console.log(" Departments seeded");

  const roles = [
    "ADMIN",
    "STUDENT",
    "SUPERVISOR",
    "INTERNSHIP_MANAGER",
    "DEPARTMENT_HEAD",
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  console.log(" Roles seeded");

  const adminRole = await prisma.role.findUnique({
    where: {
      name: "ADMIN",
    },
  });

  if (!adminRole) {
    throw new Error("ADMIN role not found");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: process.env.ADMIN_EMAIL || "admin@internship.com",
    },
  });

  if (existingAdmin) {
    console.log(" Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin123@",
    10
  );

  await prisma.user.create({
    data: {
      firstName: "test",
      lastName: "Admin",
      email: process.env.ADMIN_EMAIL || "adminTest@internship.com",
      password: hashedPassword,
      roleId: adminRole.id,

      admin: {
        create: {},
      },
    },
  });

  console.log(" Admin seeded");
}

main()
  .catch((error) => {
    console.error(" Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

