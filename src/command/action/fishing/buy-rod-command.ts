import { Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { buyRodReply } from "./utils/buy-rod-reply";

export class BuyRodCommand extends CommandBase {
  protected name: string = "joran";
  protected description: string = "Beli joran untuk memancing";

  public async action(interaction: Interaction): Promise<void> {
    // Cek apakah bisa di reply
    if (!interaction.isRepliable()) return;

    // Defer
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

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

    await buyRodReply(interaction, 1, 2);
  }
}