import { Interaction } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { buyCharmReply } from "./utils/buy-charm-reply";

export class BuyCharmCommand extends CommandBase {
  protected name: string = "jimat";
  protected description: string = "Beli jimat keberuntungan";

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

    await buyCharmReply(interaction, 1, 2);
  }
}