import { EmbedBuilder, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "./utils/candle-money";
import { randomPicker } from "./utils/random-picker";
import dayjs from "dayjs";

export class PickCommmand extends CommandBase {
  protected name: string = "mulung";
  protected description: string = "Cari barang - barang untuk dijual";

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

    const pick = await prisma.pick.findUnique({
      where: {
        userId: interaction.user.id
      },
      select: {
        updateAt: true
      }
    })


    // Tunggu 5 menit
    if (pick?.updateAt) {
      const diff = dayjs().diff(dayjs(pick.updateAt), "minute");
      if (diff < 5) {
        await interaction.reply({
          content: `<@${interaction.user.id}> kamu sudah berkeliling dan butuh istirahat, tunggu ${(5 - diff) > 0 ? `sekitar ${5 - diff} menit lagi` : "sebentar lagi"}.`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    const range = {
      min: 30,
      max: 70,
    }

    const arr = Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i);
    const random = randomPicker(arr);

    // update db
    await prisma.$transaction(async (prisma) => {
      // update pick
      await prisma.pick.upsert({
        where: {
          userId: interaction.user.id
        },
        update: {
          updateAt: new Date()
        },
        create: {
          userId: interaction.user.id,
          updateAt: new Date()
        }
      })

      // update wallet
      await prisma.wallet.upsert({
        where: {
          userId: interaction.user.id
        },
        update: {
          amount: {
            increment: random
          },
          all: {
            increment: random
          },
          updateAt: new Date()
        },
        create: {
          userId: interaction.user.id,
          amount: random,
          all: random,
        }
      })
    })

    await interaction.reply({
      content: `<@${interaction.user.id}> memulung barang - barang bekas`,
      embeds: [
        new EmbedBuilder()
          .setTitle("Hasil Memulung")
          .setThumbnail("https://dodo.ac/np/images/0/03/White_Wrapping_Paper_NH_Icon.png")
          .setColor("Orange")
          .addFields({
            name: "Pendapatan",
            value: candleMoney(random),
            inline: true,
          })
      ],
    });
  }
}