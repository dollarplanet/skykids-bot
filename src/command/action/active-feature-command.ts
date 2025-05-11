import { ActionRowBuilder, ComponentType, Interaction, MessageFlags, StringSelectMenuBuilder } from "discord.js";
import { CommandBase } from "./command-base";
import { prisma } from "../../singleton/prisma-singleton";
import { featureEnum } from "@prisma/xxx-client";

export class ActiveFeatureCommand extends CommandBase {
  protected name: string = "active-feature";
  protected description: string = "Atur fitur bot yang ingin diaktifkan";

  public async action(interaction: Interaction) {
    // Cek apakah pisa di reply
    if (!interaction.isRepliable()) return;

    // Dapatkan fitur di a
    const dbFeatures = await prisma.activeFeature.findMany();

    // Selection
    const select = new StringSelectMenuBuilder()
      .setCustomId(interaction.id)
      .setPlaceholder('Pilih Fitur')
      .setOptions(Object.keys(featureEnum).map((key) => ({
        label: key,
        value: key,
        default: dbFeatures.map(feature => feature.name).includes(key as featureEnum)
      })))
      .setMinValues(0);

    const row = new ActionRowBuilder()
      .addComponents(select);

    const reply = await interaction.reply({
      content: 'Pilih fitur yang ingin diaktifkan',
      components: [row as any],
      flags: MessageFlags.Ephemeral,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: i => (i.user.id === interaction.user.id) && (i.customId === interaction.id),
      time: 120_000,
    });

    collector.on('collect', async inter => {
      try {
        //simpan di db
        await prisma.$transaction(async prisma => {
          await prisma.activeFeature.deleteMany();
          await prisma.activeFeature.createMany({
            data: inter.values.map(value => ({ name: value as featureEnum })),
          });
        })

        await interaction.deleteReply();
        await inter.reply({
          content: 'Fitur berhasil diubah',
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