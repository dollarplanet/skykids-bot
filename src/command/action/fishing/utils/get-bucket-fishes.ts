import { prisma } from "../../../../singleton/prisma-singleton";
import { pageLimit } from "./limit";

export async function getBucketFishes(userId: string, cursor: number) {

  const realCursor = cursor > 0 ? {
    id: cursor,
  } : undefined;

  const fishes = await prisma.bucket.findMany({
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
    take: pageLimit,
    cursor: realCursor,
    skip: cursor === 0 ? 0 : 1,
  });

  return fishes;
}