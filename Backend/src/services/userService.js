import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (search = "", role = "") => {
  const where = {};

  if (search) {
    where.OR = [
      {
        firstName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (role) {
    where.role = {
      name: role,
    };
  }

  return await prisma.user.findMany({
    where,

    include: {
      role: true,

      student: {
        include: {
          department: true,
        },
      },

      supervisor: {
        include: {
          department: true,
        },
      },

      departmentHead: {
        include: {
          department: true,
        },
      },
    },

    orderBy: {
      firstName: "asc",
    },
  });
};

const validateRoleFields = (role, fields) => {
  const { studentCode, level, department, speciality } = fields;

  if (role === "STUDENT") {
    if (!studentCode || !level || !department) {
      throw new Error(
        "Code étudiant, niveau et département sont obligatoires pour un étudiant",
      );
    }
  }

  if (role === "SUPERVISOR") {
    if (!department || !speciality) {
      throw new Error(
        "Département et spécialité sont obligatoires pour un encadrant",
      );
    }
  }

  if (role === "DEPARTMENT_HEAD") {
    if (!department) {
      throw new Error("Le département est obligatoire pour un chef de département");
    }
  }
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

  if (!firstName || !lastName || !email || !password || !role) {
    throw new Error("Prénom, nom, email, mot de passe et rôle sont obligatoires");
  }

  if (password.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères");
  }

  validateRoleFields(role, {
    studentCode,
    level,
    department,
    speciality,
  });

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Cet email est déjà utilisé");
  }

  const roleData = await prisma.role.findUnique({
    where: {
      name: role,
    },
  });

  if (!roleData) {
    throw new Error("Rôle invalide");
  }

  let departmentData = null;

  if (department) {
    departmentData = await prisma.department.findUnique({
      where: {
        name: department,
      },
    });

    if (!departmentData) {
      throw new Error("Département introuvable");
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
        mustChangePassword: true,
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
        throw new Error("Rôle invalide");
    }

    return await tx.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        role: true,
        student: {
          include: {
            department: true,
          },
        },
        supervisor: {
          include: {
            department: true,
          },
        },
        departmentHead: {
          include: {
            department: true,
          },
        },
      },
    });
  });
};

// export const updateUser = async (userId, userData) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     password,
//   } = userData;

//   const user = await prisma.user.findUnique({
//     where: {
//       id: Number(userId),
//     },
//   });

//   if (!user) {
//     throw new Error("Utilisateur introuvable");
//   }

//   const data = {};

//   if (firstName !== undefined) data.firstName = firstName;
//   if (lastName !== undefined) data.lastName = lastName;
//   if (email !== undefined) data.email = email;

//   if (password) {
//     data.password = await bcrypt.hash(password, 10);
//   }

//   return await prisma.user.update({
//     where: {
//       id: Number(userId),
//     },
//     data,
//   });
// };


export const updateUser = async (userId, userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    studentCode,
    level,
    department,
    speciality,
  } = userData;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      role: true,
      student: true,
      supervisor: true,
      departmentHead: true,
    },
  });

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  if (!firstName || !lastName || !email) {
    throw new Error("Prénom, nom et email sont obligatoires");
  }

  if (password && password.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères");
  }

  if (email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Cet email est déjà utilisé");
    }
  }

  validateRoleFields(user.role.name, {
    studentCode,
    level,
    department,
    speciality,
  });

  const data = {
    firstName,
    lastName,
    email,
  };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
    data.mustChangePassword = true;
  }

  let departmentData = null;

  if (department) {
    departmentData = await prisma.department.findUnique({
      where: {
        name: department,
      },
    });

    if (!departmentData) {
      throw new Error("Département introuvable");
    }
  }

  return await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: Number(userId),
      },
      data,
    });

    switch (user.role.name) {
      case "STUDENT":
        await tx.student.update({
          where: {
            userId: Number(userId),
          },
          data: {
            studentCode,
            level,
            departmentId: departmentData?.id,
          },
        });
        break;

      case "SUPERVISOR":
        await tx.supervisor.update({
          where: {
            userId: Number(userId),
          },
          data: {
            speciality,
            departmentId: departmentData?.id,
          },
        });
        break;

      case "DEPARTMENT_HEAD":
        await tx.departmentHead.update({
          where: {
            userId: Number(userId),
          },
          data: {
            departmentId: departmentData?.id,
          },
        });
        break;
    }

    return await tx.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        role: true,
        student: {
          include: {
            department: true,
          },
        },
        supervisor: {
          include: {
            department: true,
          },
        },
        departmentHead: {
          include: {
            department: true,
          },
        },
      },
    });
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
    throw new Error("Utilisateur introuvable");
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