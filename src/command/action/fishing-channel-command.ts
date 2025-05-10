import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, ComponentType, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "./command-base";
import { prisma } from "../../singleton/prisma-singleton";

export class FishingChannelCommand extends CommandBase {
  protected name: string = "fishing-channel";
  protected description: string = "Atur channel untuk game mancing mania";

  public async action(interaction: Interaction) {
    // Cek apakah pisa di reply
    if (!interaction.isRepliable()) return;

    // Cek config
    const config = await prisma.config.findUnique({
      where: {
        id: 1,
      },
      select: {
        fishingChannel: true
      }
    })

    // Selection
    const select = new ChannelSelectMenuBuilder()
      .setCustomId(interaction.id)
      .setPlaceholder('Pilih Channel')
      .setChannelTypes(ChannelType.GuildText)
      .setMinValues(1)
      .setMaxValues(1);

    // Existing config
    if (config?.fishingChannel) {
      select.setDefaultChannels([config.fishingChannel]);
    }

    const row = new ActionRowBuilder()
      .addComponents(select);

    const reply = await interaction.reply({
      content: 'Pilih channel untuk game mancing mania',
      components: [row as any],
      flags: MessageFlags.Ephemeral,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.ChannelSelect,
      filter: i => (i.user.id === interaction.user.id) && (i.customId === interaction.id),
      time: 60_000,
    });

    collector.on('collect', async i => {
      try {
        const data = {
          fishingChannel: i.values[0]
        };

        await prisma.config.upsert({
          where: {
            id: 1,
          },
          create: data,
          update: {
            ...data,
            updateAt: new Date(),
          },
        });

        await interaction.deleteReply();
        await i.reply({
          content: 'Channel game mancing mania telah diatur',
          ephemeral: true
        });
      } catch {
        //
      } finally {
        collector.removeAllListeners();
        collector.stop();
      }
    });
  }

}