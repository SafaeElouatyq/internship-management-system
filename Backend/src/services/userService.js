import prisma from "../config/prisma.js";

export const getAllUsers = async () =>{
    return await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: {
                select: {
                    name: true
                }
            }
        }
    });
}