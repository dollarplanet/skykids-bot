import { EmbedBuilder, Interaction } from "discord.js";
import { InteractionCreateListener } from "../../../feature/base/interaction-create-listener";
import { prisma } from "../../../singleton/prisma-singleton";
import { isFeatureDisabled } from "../../../utils/is-feature-disabled";
import { candleMoney } from "./utils/candle-money";

export class CurrentRodListener extends InteractionCreateListener {
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

    if (interaction.customId !== 'joran_current') return;

    // Cek apakah sudah punya joran
    const rodState = await prisma.rodState.findUnique({
      where: {
        userId: interaction.user.id
      },
      include: {
        rod: true
      }
    })

    // Kalo belum punya joran
    if (!rodState?.rod) {
      await interaction.update({
        content: "Kamu belum punya joran, gunakan command /joran untuk membeli joran.",
        components: [],
        embeds: [],
      });
      return;
    };

    // Reply
    await interaction.deferUpdate();
    await interaction.deleteReply();
    if (!interaction.channel?.isSendable()) return;
    await interaction.channel.send({
      content: `Joran milik <@${interaction.user.id}>`,
      components: [],
      embeds: [new EmbedBuilder()
        .setTitle(rodState.rod.name)
        .setThumbnail(rodState.rod.image)
        .setColor("Orange")
        .addFields({
          name: "Harga",
          value: candleMoney(rodState.rod.price),
          inline: true,
        })
        .addFields({
          name: "Kekuatan",
          value: `${rodState.energy} tarikan`,
          inline: true,
        })
        .addFields({
          name: "Peluang",
          value: rodState.rod.possibilityPercentAdded === 0 ? "Basic" : `+ ${rodState.rod.possibilityPercentAdded}%`,
          inline: true,
        }),
      ],
    });
  }
}