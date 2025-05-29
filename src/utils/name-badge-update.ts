import { GuildMember } from "discord.js";
import { prisma } from "../singleton/prisma-singleton";

export async function nameBadgeCheck(user: GuildMember, forceCheck: boolean = false) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: user.id
      },
      select: {
        all: true
      }
    });

    const stat = await prisma.userStatistic.findUnique({
      where: {
        userId: user.id
      },
      select: {
        triviaCorrectCount: true,
        fishingBadgeObtained: true,
        triviaBadgeObtained: true,
      }
    });

    let badges = "";

    if (((wallet?.all ?? 0) >= 10_000) && (forceCheck || !stat?.fishingBadgeObtained)) {
      badges += "🐟";
      await prisma.userStatistic.upsert({
        where: {
          userId: user.id
        },
        create: {
          userId: user.id
        },
        update: {
          fishingBadgeObtained: true
        }
      });
    }

    if ((stat?.triviaCorrectCount ?? 0) >= 10 && (forceCheck || !stat?.triviaBadgeObtained)) {
      badges += "📜";
      await prisma.userStatistic.upsert({
        where: {
          userId: user.id
        },
        create: {
          userId: user.id
        },
        update: {
          triviaBadgeObtained: true
        }
      });
    }

    // send DM
    if ((badges.length > 0) && !forceCheck) {
      await user.send(`Selamat, kamu mendapatkan lencana ${badges}!`);
    }

    return badges;
  } catch {
    return "";
  }
}

export function badgeClearSafety(providedNickname: string, badges: string) {
  if (badges === "") return providedNickname;

  let nickname = providedNickname;
  for (const badge of badges) {
    nickname = nickname.replace(badge, "");
  }
  return nickname;
}

export async function nameBadgeUpdate(user: GuildMember) {
  try {
    const badges = await nameBadgeCheck(user);

    const nickname = badgeClearSafety(user.nickname ?? user.user.username, badges);
    // ganti nickname
    await user.setNickname(`${nickname} ${badges}`);
  } catch {
    //
  }
}