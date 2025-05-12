import { EmbedBuilder, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "./utils/candle-money";
import dayjs from "dayjs";
import { getDayName, getMonthName } from "../../../utils/date-utils";

export class ShowoffCommand extends CommandBase {
  protected name: string = "pamer";
  protected description: string = "Pamerin 3 ikan terbaikmu";

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

    // Dapatkan 3 ikan termahal
    const fishes = await prisma.bucket.findMany({
      where: {
        userId: interaction.user.id,
      },
      select: {
        fish: true,
        updateAt: true,
        rod: true
      },
      orderBy: {
        fish: {
          price: "desc",
        },
      },
      take: 3,
    });

    // Kalo belum punya ikan
    if (fishes.length === 0) {
      await interaction.reply({
        content: "Kamu belum menangkap ikan apapun :(",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    // Reply
    await interaction.reply({
      content: `Lihat!, ${fishes.length} ikan terbaik di ember <@${interaction.user.id}>`,
      embeds: fishes.map(data => {
        const catchedAt = dayjs(data.updateAt).tz("Asia/Jakarta");
        return new EmbedBuilder()
          .setTitle(data.fish.name)
          .setDescription(`Ditangkap pada ${getDayName(catchedAt.day())}, ${catchedAt.format(`DD ##### YYYY, HH:mm`).replace("#####", getMonthName(catchedAt.month()))} WIB, menggunakan ${data.rod.name}`)
          .setThumbnail(data.fish.image)

          .addFields({
            name: "Harga",
            value: candleMoney(data.fish.price) + ` (${data.fish.rarity})`,
            inline: true,
          })
      }),
    });
  }

}