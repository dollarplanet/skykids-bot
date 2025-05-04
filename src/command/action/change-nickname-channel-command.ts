import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, ComponentType, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "./command-base";
import { prisma } from "../../singleton/prisma-singleton";

export class ChangeNicknameChannelCommand extends CommandBase {
  protected name: string = "change-nickname-channel";
  protected description: string = "Atur channel untuk ganti nickname";

  public async action(interaction: Interaction) {
    // Cek apakah pisa di reply
    if (!interaction.isRepliable()) return;

    // Cek config
    const config = await prisma.config.findUnique({
      where: {
        id: 1,
      },
      select: {
        changeNicknameChannel: true
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
    if (config?.changeNicknameChannel) {
      select.setDefaultChannels([config.changeNicknameChannel]);
    }

    const row = new ActionRowBuilder()
      .addComponents(select);

    const reply = await interaction.reply({
      content: 'Pilih channel untuk ganti nickname',
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
        await prisma.config.upsert({
          where: {
            id: 1,
          },
          create: {
            changeNicknameChannel: i.values[0],
          },
          update: {
            changeNicknameChannel: i.values[0],
          },
        });

        await interaction.deleteReply();
        await i.reply({
          content: 'Channel berhasil diubah',
          flags: MessageFlags.Ephemeral
        });
      } catch {
        //
      }
    });
  }
}