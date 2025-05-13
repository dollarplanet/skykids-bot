import { EmbedBuilder, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "./utils/candle-money";

export class SellLimitAll extends CommandBase {
  protected name: string = "jual-duplikat";
  protected description: string = "Jual semua ikan yang jumlahnya lebih dari satu";

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

    // Daptkan ikan duplikat
    const fishes = await prisma.bucket.findMany({
      where: {
        userId: interaction.user.id,
        quantity: {
          gt: 1
        }
      },
      select: {
        fish: {
          select: {
            price: true
          }
        },
        quantity: true
      }
    });

    // Kalo kosong
    if (fishes.length === 0) {
      await interaction.reply({
        content: "Kamu tidak memiliki ikan duplikat untuk dijual, silahkan jual manual di command /ember",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const cost = fishes.reduce((acc, cur) => acc + (cur.fish.price * (cur.quantity - 1)), 0);
    // update db
    await prisma.$transaction(async (tx) => {
      await tx.bucket.updateMany({
        where: {
          userId: interaction.user.id,
          quantity: {
            gt: 1
          }
        },
        data: {
          quantity: 1
        }
      });

      await tx.wallet.update({
        where: {
          userId: interaction.user.id
        },
        data: {
          amount: {
            increment: cost
          }
        }
      });
    });

    //reply
    await interaction.reply({
      content: `<@${interaction.user.id}> menjual semua ikan duplikat`,
      embeds: [
        new EmbedBuilder()
          .setTitle("Jual Ikan")
          .setThumbnail("https://dodo.ac/np/images/a/a7/Shop_Model_PG_Model.png")
          .setColor("Orange")
          .addFields({
            name: "Pendapatan",
            value: candleMoney(cost),
            inline: true,
          })
      ],
    });
  }
}