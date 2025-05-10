import dayjs from "dayjs";
import { prisma } from "../../../../singleton/prisma-singleton";

export async function getCurrentFishes() {
  // dapatkan jam dan bulan
  const now = dayjs().tz('Asia/Jakarta').locale('id');
  const hour = now.hour();
  const month = now.month() + 1;

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
  })

  return fishes;
}