import { EmbedBuilder, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "./utils/candle-money";
import dayjs from "dayjs";
import { getDayName } from "../../../utils/date-utils";

export class WorkCommand extends CommandBase {
  protected name: string = "kerja";
  protected description: string = "Kerja untuk mendapatkan uang tambahan";

  public async action(interaction: Interaction): Promise<void> {
    // Cek apakah bisa di reply
    if (!interaction.isRepliable()) return;

    // pastikan dari fishing channel
    const channel = await prisma.config.findUnique({
      where: {
        id: 1,
      },
      select: {
        fishingChannel: true
      }
    });
    if (interaction.channelId !== channel?.fishingChannel) return;

    // timer
    const lastResetTime = dayjs().tz("America/Yakutat").hour(0).minute(0).second(0).millisecond(0);
    const incomingResetTime = lastResetTime.add(1, "day");
    const lastWork = await prisma.work.findUnique({
      where: {
        userId: interaction.user.id
      },
      select: {
        updateAt: true
      }
    })

    const alreadyWorking = lastWork === null ? false : dayjs(lastWork.updateAt).isAfter(lastResetTime);

    // Kalo udah kerja
    if (alreadyWorking) {
      await interaction.reply({
        content: `<@${interaction.user.id}> kamu sudah kerja hari ini, tunggu sampai ${getDayName(incomingResetTime.day())} ${incomingResetTime.tz("Asia/Jakarta").format("HH:mm")} WIB`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    // update db
    await prisma.$transaction(async (prisma) => {
      //update work
      await prisma.work.upsert({
        where: {
          userId: interaction.user.id
        },
        update: {
          updateAt: dayjs().tz("America/Yakutat").toDate()
        },
        create: {
          updateAt: dayjs().tz("America/Yakutat").toDate(),
          userId: interaction.user.id
        }
      });

      // update wallet
      await prisma.wallet.upsert({
        where: {
          userId: interaction.user.id
        },
        update: {
          amount: {
            increment: 500
          },
          all: {
            increment: 500
          },
          updateAt: new Date()
        },
        create: {
          amount: 500,
          all: 500,
          updateAt: new Date(),
          userId: interaction.user.id
        }
      });
    })

    // reply
    await interaction.reply({
      content: `<@${interaction.user.id}> kerja di toko roti dan mendapatkan ${candleMoney(500)}`,
      embeds: [
        new EmbedBuilder()
          .setTitle("Toko Roti")
          .setThumbnail("https://dodo.ac/np/images/1/19/Organic_Bread_NH_DIY_Icon.png")
          .setColor("Orange")
          .addFields({
            name: "Bayaran",
            value: candleMoney(500),
            inline: true,
          })
      ]
    });
  }
}