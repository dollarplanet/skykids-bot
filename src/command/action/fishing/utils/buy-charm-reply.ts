import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, EmbedBuilder, MessageFlags, RepliableInteraction } from "discord.js";
import { prisma } from "../../../../singleton/prisma-singleton";
import { candleMoney } from "./candle-money";

export async function buyCharmReply(interaction: RepliableInteraction<CacheType>, currentId: number, nextId: number) {
  // Dapatkan charm
  const charm = await prisma.charm.findUnique({
    select: {
      price: true,
      defaultEnergy: true,
      name: true,
      image: true,
      luckyPercentAdded: true,
    },
    where: {
      id: currentId
    }
  });

  if (!charm) return;

  // hitung seluruh charm
  const count = await prisma.charm.count();

  const next = new ButtonBuilder()
    .setCustomId(`charm_next-${nextId}`)
    .setLabel('Next')
    .setStyle(ButtonStyle.Primary);

  const buy = new ButtonBuilder()
    .setCustomId(`charm_buy-${currentId}`)
    .setLabel('Beli')
    .setStyle(ButtonStyle.Success);

  const current = new ButtonBuilder()
    .setCustomId("charm_current")
    .setLabel('Jimat Saya')
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder();
  if (count > currentId) row.addComponents(next);
  row.addComponents(buy, current);

  const data = {
    content: "**Pilih Jimat**",
    components: [row as any],
    embeds: [new EmbedBuilder()
      .setTitle(charm.name)
      .setThumbnail(charm.image)
      .setColor("Orange")
      .addFields({
        name: "Harga",
        value: candleMoney(charm.price),
        inline: true,
      })
      .addFields({
        name: "Pemakaian",
        value: `${charm.defaultEnergy} kali`,
        inline: true,
      })
      .addFields({
        name: "Keberuntungan",
        value: `+ ${charm.luckyPercentAdded}%`,
        inline: true,
      })
    ],
  };

  if (interaction.isButton()) {
    await interaction.update(data);
  } else {
    await interaction.reply({
      ...data,
      flags: MessageFlags.Ephemeral
    });
  }
}