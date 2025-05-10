import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction } from "discord.js";
import { InteractionCreateListener } from "../../../feature/base/interaction-create-listener";
import { isFeatureDisabled } from "../../../utils/is-feature-disabled";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "./utils/candle-money";
import { pageLimit } from "./utils/limit";
import { getBucketFishes } from "./utils/get-bucket-fishes";

export class BucketNextListener extends InteractionCreateListener {
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
    if (!customId.startsWith('ember_next-')) return;

    // Dapatkan ikan
    const fishes = await getBucketFishes(interaction.user.id, parseInt(customId.split('-')[1]));

    // kalo ikan kosong
    if (fishes.paged.length === 0) {
      await interaction.update({
        content: "Ikan sudah ditampilkan semua",
        embeds: [],
        components: []
      });
      return;
    }

    const isDone = (fishes.paged.length < pageLimit) || (fishes.paged.length === 0);

    const next = new ButtonBuilder()
      .setCustomId(`ember_next-${fishes.paged[fishes.paged.length - 1].id}`)
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder();

    if (!isDone) {
      row.addComponents(next);
    }

    const totalPrice = fishes.all.reduce((total, fish) => {
      return total + (fish.fish.price * fish.quantity);
    }, 0)

    const totalFishes = fishes.all.reduce((total, fish) => {
      return total + fish.quantity;
    }, 0)

    await interaction.update({
      content: `Kamu memiliki ${totalFishes} ekor ikan dalam ember dengan ${fishes.all.length} jenis ikan yang berbeda. 
    Total harga: ${candleMoney(totalPrice)}\n`,
      components: isDone ? [] : [row as any],
      embeds: fishes.paged.map(data => {
        return new EmbedBuilder()
          .setTitle(data.fish.name)
          .setThumbnail(data.fish.image)
          .addFields({
            name: "Jumlah",
            value: data.quantity.toString() + " Ekor",
            inline: true,
          })
          .addFields({
            name: "Total Harga",
            value: candleMoney(data.fish.price * data.quantity) + ` (${data.fish.rarity})`,
            inline: true,
          })
      }),
    });
  }
}