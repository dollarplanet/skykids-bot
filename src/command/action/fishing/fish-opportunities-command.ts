import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { getCurrentFishes } from "./utils/get-current-fishes";
import { candleMoney } from "./utils/candle-money";
import { pageLimit } from "./utils/limit";

export class FishOpportunitiesCommand extends CommandBase {
  protected name: string = "peluang";
  protected description: string = "Dapatkan info peluang ikan yang akan di dapatkan";

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
      },
    });
    if (interaction.channelId !== channel?.fishingChannel) return;

    // dapatkan ikan 
    const fishes = await getCurrentFishes(0);

    // kalo ikan kosong
    if (fishes.length === 0) {
      await interaction.reply("Tidak ada ikan untuk saat ini :(");
      return;
    }

    const isDone = (fishes.length < pageLimit) || (fishes.length === 0);

    const next = new ButtonBuilder()
      .setCustomId(`peluang_next-${fishes[fishes.length - 1].id}`)
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder();

    if (!isDone) {
      row.addComponents(next);
    }

    // kalo ikan ada
    await interaction.reply({
      content: "Ikan yang berbeda memiliki jadwal yang berbeda juga. Semakin tinggi tingkat rarity, semakin sulit untuk mendapatkannya. Untuk waktu saat ini, kamu berpeluang mendapatkan ikan:\n",
      flags: MessageFlags.Ephemeral,
      components: isDone ? [] : [row as any],
      embeds: fishes.map(fish => {
        return new EmbedBuilder()
          .setTitle(fish.name)
          .setThumbnail(fish.image)
          .addFields({
            name: "Harga",
            value: candleMoney(fish.price) + ` (${fish.rarity})`,
            inline: true,
          })
      }),
    });
  }
}