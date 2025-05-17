import { Interaction } from "discord.js";
import { InteractionCreateListener } from "../../../feature/base/interaction-create-listener";
import { isFeatureDisabled } from "../../../utils/is-feature-disabled";
import { prisma } from "../../../singleton/prisma-singleton";
import { buyCharmReply } from "./utils/buy-charm-reply";

export class BuyCharmNextListener extends InteractionCreateListener {
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

    // Harus dari channel
    if (interaction.channelId !== config.fishingChannel) return;

    // Harus bukan bot
    if (interaction.user.bot) return;

    // Harus button
    if (!interaction.isButton()) return;

    const customId = interaction.customId;
    if (!customId.startsWith('charm_next-')) return;

    const currentId = parseInt(customId.split('-')[1]);

    await buyCharmReply(interaction, currentId, currentId + 1);
  }
}