import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, EmbedBuilder, MessageFlags, RepliableInteraction } from "discord.js";
import { prisma } from "../../../../singleton/prisma-singleton";
import { candleMoney } from "./candle-money";

export async function buyRodReply(interaction: RepliableInteraction<CacheType>, currentId: number, nextId: number) {
  // Dapatkan joran
  const rod = await prisma.rod.findUnique({
    select: {
      price: true,
      defaultEnergy: true,
      name: true,
      image: true,
      possibilityPercentAdded: true,
    },
    where: {
      id: currentId
    }
  });

  if (!rod) return;

  // hitung seluruh joran
  const count = await prisma.rod.count();

  const next = new ButtonBuilder()
    .setCustomId(`joran_next-${nextId}`)
    .setLabel('Next')
    .setStyle(ButtonStyle.Primary);

  const buy = new ButtonBuilder()
    .setCustomId(`joran_buy-${currentId}`)
    .setLabel('Beli')
    .setStyle(ButtonStyle.Success);

    const current = new ButtonBuilder()
      .setCustomId("joran_current")
      .setLabel('Joran Saya')
      .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder();
  if (count > currentId) row.addComponents(next);
  row.addComponents(buy, current);

  const data = {
    content: "**Pilih Joran**",
    components: [row as any],
    embeds: [new EmbedBuilder()
      .setTitle(rod.name)
      .setThumbnail(rod.image)
      .setColor("Orange")
      .addFields({
        name: "Harga",
        value: candleMoney(rod.price),
        inline: true,
      })
      .addFields({
        name: "Kekuatan",
        value: `${rod.defaultEnergy} tarikan`,
        inline: true,
      })
      .addFields({
        name: "Peluang",
        value: rod.possibilityPercentAdded === 0 ? "Basic" : `+ ${rod.possibilityPercentAdded}%`,
        inline: true,
      })
    ],
  };

  if (interaction.isButton()) {
    interaction.update(data);
  } else {
    interaction.reply({
      ...data,
      flags: MessageFlags.Ephemeral
    });
  }
}