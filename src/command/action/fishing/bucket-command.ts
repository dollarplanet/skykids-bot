import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { getBucketFishes } from "./utils/get-bucket-fishes";
import { candleMoney } from "./utils/candle-money";
import { pageLimit } from "./utils/limit";

export class BucketCommand extends CommandBase {
  protected name: string = "ember";
  protected description: string = "Lihat semua ikan hasil tangkapan kamu disini";

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

    // Dapatkan ikan dalam ember
    const fishes = await getBucketFishes(interaction.user.id, 0);

    // kalo ikan kosong
    if (fishes.all.length === 0) {
      await interaction.reply({
        content: "Kamu belum menangkap ikan apapun :(",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const isDone = (fishes.paged.length < pageLimit) || (fishes.paged.length === 0);

    const next = new ButtonBuilder()
      .setCustomId(`ember_next-${fishes.paged[fishes.paged.length - 1].id}`)
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary);

    const sell = new ButtonBuilder()
      .setCustomId("sell-0")
      .setLabel('Jual')
      .setStyle(ButtonStyle.Danger);

    const sellLimit = new ButtonBuilder()
      .setCustomId("sell_limit-0")
      .setLabel('Jual Sisakan 1')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder();
    let rowLength = 0

    if (!isDone) {
      row.addComponents(next);
      rowLength++;
    }

    row.addComponents(sell);
    rowLength++;

    if (fishes.paged.filter(fish => fish.quantity > 1).length > 0) {
      row.addComponents(sellLimit);
      rowLength++;
    }

    const totalFishes = fishes.all.reduce((total, fish) => {
      return total + fish.quantity;
    }, 0)

    await interaction.reply({
      content: `Kamu memiliki ${totalFishes} ekor ikan dalam ember dengan ${fishes.all.length} jenis ikan yang berbeda.`,
      components: (rowLength === 0) ? [] : [row as any],
      flags: MessageFlags.Ephemeral,
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