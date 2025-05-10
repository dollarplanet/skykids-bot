import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction } from "discord.js";
import { InteractionCreateListener } from "../../../feature/base/interaction-create-listener";
import { isFeatureDisabled } from "../../../utils/is-feature-disabled";
import { prisma } from "../../../singleton/prisma-singleton";
import { getCurrentFishes } from "./utils/get-current-fishes";
import { candleMoney } from "./utils/candle-money";
import { pageLimit } from "./utils/limit";

export class OpportunitiesNextListener extends InteractionCreateListener {
  public async action(interaction: Interaction): Promise<void> {
    // Cek interaction dapat dibalas
    if (!interaction.isRepliable()) return;

    // Cek fitur dimatikan
    if (await isFeatureDisabled("Fishing")) return;

    // Dapatkan config
    const config = await prisma.config.findUnique({
      where: {
        id: 1,
      },
      select: {
        fishingChannel: true
      }
    })
    if (!config) return;

    // Harus dari channel change nickname
    if (interaction.channelId !== config.fishingChannel) return;

    // Harus bukan bot
    if (interaction.user.bot) return;

    // Harus button
    if (!interaction.isButton()) return;

    const customId = interaction.customId;
    if (!customId.startsWith('peluang_next-')) return;

    // Dapatkan ikan
    const fishes = await getCurrentFishes(parseInt(customId.split('-')[1]));

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

    await interaction.update({
      content: "Ikan yang berbeda memiliki jadwal yang berbeda juga. Semakin tinggi tingkat rarity, semakin sulit untuk mendapatkannya. Untuk waktu saat ini, kamu berpeluang mendapatkan ikan:",
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