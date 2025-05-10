import dayjs from "dayjs";
import { prisma } from "../../../../singleton/prisma-singleton";

export async function getCurrentFishes(cursor?: number) {
  // dapatkan jam dan bulan
  const now = dayjs().tz('Asia/Jakarta').locale('id');
  const hour = now.hour();
  const month = now.month() + 1;

  const realCursor = cursor === undefined ? undefined : (cursor > 0 ? {
    id: cursor,
  } : undefined);

  // dapatkan ikan sesuai waktu
  const fishes = await prisma.fish.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      rarity: true,
      price: true,
      time: true,
      months: true
    },
    where: {
      time: {
        has: hour,
      },
      months: {
        has: month,
      },
    },
    orderBy: {
      price: "asc",
    },
    take: cursor === undefined ? undefined : 10,
    cursor: realCursor,
    skip: cursor === 0 ? 0 : 1,
  })

  return fishes;
}