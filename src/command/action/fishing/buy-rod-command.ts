import { Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "./utils/candle-money";

const rodPrice = 500;
const rodEnergy = 5;

export class BuyRodCommand extends CommandBase {
  protected name: string = "joran";
  protected description: string = "Beli joran untuk memancing";

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

    // Kalo masih punya joran dan masih bagus
    const fishingRod = await prisma.fishingRod.findUnique({
      where: {
        userId: interaction.user.id
      },
      select: {
        energy: true,
      }
    })
    if (fishingRod && fishingRod.energy > 0) {
      await interaction.reply({
        content: "Kamu sudah punya 🎣 joran dan masih bagus, tidak perlu membeli lagi.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    // Dapatkan wallet
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: interaction.user.id
      },
      select: {
        amount: true,
        all: true
      }
    });

    // Kalo tidak punya dompet
    if (!wallet) {
      await interaction.reply({
        content: "Dompet kamu masih kosong. Coba claim daily dengan cara ketik command /daily.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    // Kalo uang cash kurang dan punya ikan di ember
    if (wallet.amount < 500 && wallet.all > 0) {
      await interaction.reply({
        content: "Candle kamu tidak cukup. Coba jual beberapa ikan di ember dengan command /ember.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    // Kalo uang cash kurang dan tidak punya ikan
    if (wallet.amount < rodPrice) {
      await interaction.reply({
        content: "Candle kamu tidak cukup. Coba claim daily dengan cara ketik command /daily.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    // Beli joran
    await prisma.$transaction(async (prisma) => {
      // Kurangi uang di dompet
      await prisma.wallet.update({
        where: {
          userId: interaction.user.id
        },
        data: {
          amount: {
            decrement: rodPrice
          }
        }
      });

      // Tambah energy joran
      await prisma.fishingRod.upsert({
        where: {
          userId: interaction.user.id
        },
        update: {
          energy: rodEnergy
        },
        create: {
          userId: interaction.user.id,
          energy: rodEnergy
        }
      });
    });

    await interaction.reply({
      content: `<@${interaction.user.id}> membeli 🎣 joran baru dengan harga ${candleMoney(rodPrice)}`,
    });
  }
}