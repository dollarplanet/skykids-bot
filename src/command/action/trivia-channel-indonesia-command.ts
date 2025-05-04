import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, ComponentType, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "./command-base";
import { prisma } from "../../singleton/prisma-singleton";

export class TriviaChannelIndonesiaCommand extends CommandBase {
  protected name: string = "indonesia-trivia-channel";
  protected description: string = "Atur channel untuk daily trivia indonesia";

  public async action(interaction: Interaction) {
    // Cek apakah pisa di reply
    if (!interaction.isRepliable()) return;

    // Cek config
    const config = await prisma.config.findUnique({
      where: {
        id: 1,
      },
      select: {
        triviaIndonesiaChannel: true
      }
    })

    // Selection
    const selectEnglish = new ChannelSelectMenuBuilder()
      .setCustomId(interaction.id)
      .setPlaceholder('Pilih Channel Indonesia')
      .setChannelTypes(ChannelType.GuildText)
      .setMinValues(1)
      .setMaxValues(1);

    // Existing config
    if (config?.triviaIndonesiaChannel) {
      selectEnglish.setDefaultChannels([config.triviaIndonesiaChannel]);
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
          triviaIndonesiaChannel: i.values[0]
        };

        await prisma.config.upsert({
          where: {
            id: 1,
          },
          create: data,
          update: data,
        });

        await interaction.deleteReply();
        await i.reply({
          content: 'Channel daily trivia telah diatur',
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