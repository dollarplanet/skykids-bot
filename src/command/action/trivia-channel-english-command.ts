import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, ComponentType, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "./command-base";
import { prisma } from "../../singleton/prisma-singleton";

export class TriviaChannelEnglishCommand extends CommandBase {
  protected name: string = "english-trivia-channel";
  protected description: string = "Atur channel untuk daily trivia english";

  public async action(interaction: Interaction) {
    // Cek apakah pisa di reply
    if (!interaction.isRepliable()) return;

    // Cek config
    const config = await prisma.config.findUnique({
      where: {
        id: 1,
      },
      select: {
        triviaEnglishChannel: true
      }
    })

    // Selection
    const selectEnglish = new ChannelSelectMenuBuilder()
      .setCustomId(interaction.id)
      .setPlaceholder('Pilih Channel English')
      .setChannelTypes(ChannelType.GuildText)
      .setMinValues(1)
      .setMaxValues(1);

    // Existing config
    if (config?.triviaEnglishChannel) {
      selectEnglish.setDefaultChannels([config.triviaEnglishChannel]);
    }

    const row = new ActionRowBuilder().addComponents(selectEnglish);

    const reply = await interaction.reply({
      content: 'Pilih channel untuk daily trivia dan english trivia',
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
          triviaEnglishChannel: i.values[0]
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
          content: 'Channel daily trivia telah diatur',
          flags: MessageFlags.Ephemeral
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