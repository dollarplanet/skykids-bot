import { ActionRowBuilder, ComponentType, Interaction, MessageFlags, RoleSelectMenuBuilder } from "discord.js";
import { CommandBase } from "./command-base";
import { prisma } from "../../singleton/prisma-singleton";

export class DefaultRoleCommand extends CommandBase {
  protected name: string = "default-role";
  protected description: string = "Set role default saat member join";

  public async action(interaction: Interaction) {
    // Cek apakah pisa di reply
    if (!interaction.isRepliable()) return;

    // Dapatkan role default di db
    const dbDefaultRoles = await prisma.defaultRole.findMany();

    // Selection
    if (interaction.guild === null) return;
    const select = new RoleSelectMenuBuilder()
      .setCustomId(interaction.id)
      .setPlaceholder('Pilih Role')
      .setDefaultRoles(dbDefaultRoles.map(role => role.roleId))
      .setMinValues(0)
      .setMaxValues(10);

    const row = new ActionRowBuilder()
      .addComponents(select);

    const reply = await interaction.reply({
      content: 'Pilih role default saat member join',
      components: [row as any],
      flags: MessageFlags.Ephemeral,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.RoleSelect,
      filter: i => (i.user.id === interaction.user.id) && (i.customId === interaction.id),
      time: 120_000,
    });

    collector.on("collect", async inter => {
      try {
        prisma.$transaction(async prisma => {
          await prisma.defaultRole.deleteMany({});
          await prisma.defaultRole.createMany({ data: inter.values.map(roleId => ({ roleId })) });
        })

        await interaction.deleteReply();
        await inter.reply({ content: 'Role default berhasil diubah', ephemeral: true });
      } catch {
        //
      } finally {
        collector.removeAllListeners();
        collector.stop();
      }
    })
  }
}