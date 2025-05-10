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
    if (fishes.length === 0) {
      await interaction.reply("Kamu belum menangkap ikan apapun :(");
      return;
    }

    const isDone = (fishes.length < pageLimit) || (fishes.length === 0);

    const next = new ButtonBuilder()
      .setCustomId(`ember_next-${fishes[fishes.length - 1].id}`)
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder();

    if (!isDone) {
      row.addComponents(next);
    }

    const totalPrice = fishes.reduce((total, fish) => {
      return total + (fish.fish.price * fish.quantity);
    }, 0)

    const totalFishes = fishes.reduce((total, fish) => {
      return total + fish.quantity;
    }, 0)

    await interaction.reply({
      content: `Kamu memiliki ${totalFishes} ekor ikan dalam ember dengan ${fishes.length} jenis ikan yang berbeda. 
Total harga: ${candleMoney(totalPrice)}\n`,
      components: isDone ? [] :[row as any],
      flags: MessageFlags.Ephemeral,
      embeds: fishes.map(data => {
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
    })
  }
}