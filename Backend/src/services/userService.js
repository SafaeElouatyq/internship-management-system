import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};



export const createUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    studentCode,
    level,
    department,
    speciality,
  } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const roleData = await prisma.role.findUnique({
    where: {
      name: role,
    },
  });

  if (!roleData) {
    throw new Error("Invalid role");
  }

  let departmentData = null;

  if (department) {
    departmentData = await prisma.department.findUnique({
      where: {
        name: department,
      },
    });

    if (!departmentData) {
      throw new Error("Department not found");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roleId: roleData.id,
      },
      include: {
        role: true,
      },
    });

    switch (roleData.name) {
      case "ADMIN":
        await tx.admin.create({
          data: {
            userId: user.id,
          },
        });
        break;

      case "STUDENT":
        await tx.student.create({
          data: {
            userId: user.id,
            studentCode,
            level,
            departmentId: departmentData.id,
          },
        });
        break;

      case "SUPERVISOR":
        await tx.supervisor.create({
          data: {
            userId: user.id,
            speciality,
            departmentId: departmentData.id,
          },
        });
        break;

      case "INTERNSHIP_MANAGER":
        await tx.internshipManager.create({
          data: {
            userId: user.id,
          },
        });
        break;

      case "DEPARTMENT_HEAD":
        await tx.departmentHead.create({
          data: {
            userId: user.id,
            departmentId: departmentData.id,
          },
        });
        break;

      default:
        throw new Error("Invalid role");
    }

    return user;
  });
};

export const updateUser = async (userId, userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
  } = userData;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const data = {};

  if (firstName !== undefined) data.firstName = firstName;
  if (lastName !== undefined) data.lastName = lastName;
  if (email !== undefined) data.email = email;

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  return await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data,
  });
};

export const deleteUser = async (userId) => {
  const id = Number(userId);

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.$transaction(async (tx) => {
    switch (user.role.name) {
      case "ADMIN":
        await tx.admin.delete({
          where: { userId: id },
        });
        break;

      case "STUDENT":
        await tx.student.delete({
          where: { userId: id },
        });
        break;

      case "SUPERVISOR":
        await tx.supervisor.delete({
          where: { userId: id },
        });
        break;

      case "INTERNSHIP_MANAGER":
        await tx.internshipManager.delete({
          where: { userId: id },
        });
        break;

      case "DEPARTMENT_HEAD":
        await tx.departmentHead.delete({
          where: { userId: id },
        });
        break;
    }

    await tx.user.delete({
      where: { id },
    });
  });
};