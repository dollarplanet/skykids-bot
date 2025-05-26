import { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, Interaction, MessageFlags, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { CommandBaseWitOption } from "./command-base-with-option";

export class MovieEventCommand extends CommandBaseWitOption {
  protected name: string = "movie-event";
  protected builder: SlashCommandOptionsOnlyBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("Buat event nonton bareng")
    .addStringOption(option => option
      .setName("name")
      .setDescription("Nama event")
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("date")
      .setDescription("Tanggal YYYY-MM-DD HH:MM")
      .setRequired(true)
    )
    .addAttachmentOption(option => option
      .setName("image")
      .setDescription("Gambar sampul")
      .setRequired(true)
    );

  public async action(interaction: Interaction): Promise<void> {
    // Cek apakah bisa di reply
    if (!interaction.isRepliable()) return;

    // cek apakah option only
    if (!interaction.isChatInputCommand()) return;

    const name = interaction.options.getString("name");
    if (!name) return;

    const dateString = (interaction.options.getString("date"));
    if (!dateString) return;
    const date = new Date(dateString);

    const image = interaction.options.getAttachment("image");
    if (!image) return;

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    try {
      const event = await interaction.guild?.scheduledEvents.create({
        name: name,
        description: `Nonton bareng film ${name}`,
        entityType: GuildScheduledEventEntityType.StageInstance,
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        channel: "1375822343720407050",
        scheduledStartTime: date,
        image: image.url
      });

      if (interaction.channel?.isSendable()) {
        const message = await interaction.channel.send(`Hey <@&1360285795159642242>! 🙌 Ayo nonton film ${name}, Kamu bisa lihat trailernya di channel <#1376573908437696614>. Kita akan putar filmnya sesuai jadwal di channel <#1375822343720407050> ya, jangan sampai terlewat nih 😉

${event?.url}`);

        await message.pin();
      }
    } catch (e: any) {
      await interaction.editReply({
        content: e.message,
      });
      return;
    }

    await interaction.editReply({
      content: "Event berhasil dibuat",
    });
  }

}