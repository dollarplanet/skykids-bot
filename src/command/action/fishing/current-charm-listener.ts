import { EmbedBuilder, Interaction } from "discord.js";
import { InteractionCreateListener } from "../../../feature/base/interaction-create-listener";
import { prisma } from "../../../singleton/prisma-singleton";
import { isFeatureDisabled } from "../../../utils/is-feature-disabled";
import { candleMoney } from "./utils/candle-money";

export class CurrentCharmListener extends InteractionCreateListener {
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

    if (interaction.customId !== 'charm_current') return;

    // Cek apakah sudah punya charm
    const charmState = await prisma.charmState.findUnique({
      where: {
        userId: interaction.user.id
      },
      include: {
        charm: true
      }
    })

    // Kalo belum punya charm
    if (!charmState?.charm) {
      await interaction.update({
        content: "Kamu belum punya jimat, gunakan command /jimat untuk membeli jimat.",
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
      content: `Jimat milik <@${interaction.user.id}>`,
      components: [],
      embeds: [new EmbedBuilder()
        .setTitle(charmState.charm.name)
        .setThumbnail(charmState.charm.image)
        .setColor("Orange")
        .addFields({
          name: "Harga",
          value: candleMoney(charmState.charm.price),
          inline: true,
        })
        .addFields({
          name: "Sisa pakai",
          value: `${charmState.energy} kali`,
          inline: true,
        })
        .addFields({
          name: "Keberuntungan",
          value: `+ ${charmState.charm.luckyPercentAdded}%`,
          inline: true,
        }),
      ],
    });
  }
}