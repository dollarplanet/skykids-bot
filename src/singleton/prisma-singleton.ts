import {PrismaClient} from "@prisma/xxx-client";


const prismaClientSingleton = () => {
  return new PrismaClient();
};

export const prisma = ((globalThis as any).prismaClient as PrismaClient) ?? prismaClientSingleton();

((globalThis as any).prismaClient as PrismaClient) = prisma;