import { EmbedBuilder, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "./utils/candle-money";

export class WalletCommand extends CommandBase {
  protected name: string = "dompet";
  protected description: string = "Lihat total candle yang kamu punya, termasuk harga ikan yang belum dijual";

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

    // Dapatkan candle di wallet
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: interaction.user.id
      },
      select: {
        amount: true,
        all: true
      }
    });

    if (!wallet) {
      await interaction.reply({
        content: "Dompet kamu masih kosong. Baca cara bermain dengan command /bantuan.",
        flags: MessageFlags.Ephemeral
      });
      return;
    };

    // reply
    await interaction.reply({
      content: `Dompet milik <@${interaction.user.id}>`,
      embeds: [
        new EmbedBuilder()
          .setTitle("Dompet")
          .setDescription(`Total candle: ${candleMoney(wallet.all)}`)
          .setThumbnail("https://dodo.ac/np/images/1/1e/99k_Bells_NH_Inv_Icon.png")
          .setColor("Blue")
          .addFields({
            name: "Cash",
            value: candleMoney(wallet.amount),
            inline: true,
          })
          .addFields({
            name: "Dalam Ember",
            value: candleMoney(wallet.all - wallet.amount),
            inline: true,
          })
      ]
    });
  }
}