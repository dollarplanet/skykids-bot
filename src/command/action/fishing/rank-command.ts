import { EmbedBuilder, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "./utils/candle-money";

export class RankCommand extends CommandBase {
  protected name = "peringkat";
  protected description = "Lihat peringkat mancing mania";

  async action(interaction: Interaction) {
    // Cek apakah bisa di reply
    if (!interaction.isRepliable()) return;

    // pastikan dari fishing channel
    const channel = await prisma.config.findUnique({
      where: {
        id: 1,
      },
      select: {
        fishingChannel: true
      }
    });
    if (interaction.channelId !== channel?.fishingChannel) return;

    await interaction.deferReply();

    try {

    // dapatkan user
    const ranked = await prisma.wallet.findMany({
      select: {
        userId: true,
        all: true,
      },
      orderBy: {
        all: "desc",
      }
    });

    // Kalo masih kosong
    if (ranked.length === 0) {
      await interaction.reply({
        content: "Peringkat mancing mania masih kosong :(",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    // Get current user rank
    const currentUser = ranked.find(wallet => wallet.userId === interaction.user.id);
    const content = currentUser ?
      `<@${interaction.user.id}> berada di urutan ${ranked.findIndex(wallet => wallet.userId === interaction.user.id) + 1} dengan total ${candleMoney(currentUser.all)}\n\n`
      : `<@${interaction.user.id}> belum ada dalam peringkat mancing mania, yuk mulai memancing!\n\n`;

    const embed = new EmbedBuilder()
      .setThumbnail("https://dodo.ac/np/images/e/ea/Autumn_Medal_PG_Model.png");

    let embedDescription = "";

    // Add fields
    let index = 0;
    for (const wallet of ranked) {
      if (index >= 20) break;

      const user = await interaction.guild!.members.fetch(wallet.userId);
      embedDescription += `**${index + 1}. ${user.nickname}** => ${candleMoney(wallet.all)}\n`;
      index++;
    }

    embed.setDescription(embedDescription);

    // Send
    await interaction.editReply({
      content: content,
      embeds: [embed],
    });
  } catch (e: any) {
    console.log(e.message);
    await interaction.editReply('Terjadi kesalahan teknis');
  }
  }
}