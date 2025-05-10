import { OmitPartialGroupDMChannel, Message, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, MessageFlags } from "discord.js";
import { FishingActionBase } from "./fishing-action-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "../../../command/action/fishing/utils/candle-money";

export class BucketCheck extends FishingActionBase {
  public commands: string[] = ["ember"];

  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
    // Dapatkan ikan dalam ember
    const fishes = await prisma.bucket.findMany({
      where: {
        userId: data.author.id,
      },
      select: {
        id: true,
        fish: {
          select: {
            name: true,
            image: true,
            price: true,
            rarity: true
          }
        },
        quantity: true,
      }
    });

    // Kalo kosong
    if (fishes.length === 0) {
      await data.reply("Kamu tidak memiliki ikan dalam ember");
      return;
    }

    // Buat thread untuk jawaban
    const thread = await data.startThread({
      name: "Ember",
      autoArchiveDuration: 60,
    })

    const totalPrice = fishes.reduce((total, fish) => {
      return total + (fish.fish.price * fish.quantity);
    }, 0)

    const totalFishes = fishes.reduce((total, fish) => {
      return total + fish.quantity;
    }, 0)

    await thread.send({
      content: `Kamu memiliki ${totalFishes} ekor ikan dalam ember. 
Total harga: ${candleMoney(totalPrice)}`,
      flags: MessageFlags.SuppressNotifications,
    });

    for (const data of fishes) {
      const all = new ButtonBuilder()
        .setCustomId('sellAll')
        .setLabel('Jual Semua')
        .setStyle(ButtonStyle.Danger);

      const sell = new ButtonBuilder()
        .setCustomId('sell')
        .setLabel('Sisakan 1')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder()
        .addComponents(all);

      if (data.quantity > 1) {
        row.addComponents(sell);
      }

      await thread.send({
        components: [row as any],
        flags: MessageFlags.SuppressNotifications,
        embeds: [
          new EmbedBuilder()
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
        ],
      });
    }
  }
}