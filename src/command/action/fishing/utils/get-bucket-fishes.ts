import { prisma } from "../../../../singleton/prisma-singleton";
import { pageLimit } from "./limit";

export async function getBucketFishes(userId: string, cursor: number) {

  const realCursor = cursor > 0 ? {
    id: cursor,
  } : undefined;

  const paged = await prisma.bucket.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      fish: {
        select: {
          name: true,
          image: true,
          price: true,
          rarity: true
        }
      },
      quantity: true,
    },
    orderBy: {
      fish: {
        price: "desc",
      }
    },
    take: pageLimit,
    cursor: realCursor,
    skip: cursor === 0 ? 0 : 1,
  });

  const all = await prisma.bucket.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      fish: {
        select: {
          price: true,
        }
      },
      quantity: true,
    },
  });

  return {
    all,
    paged
  };
}