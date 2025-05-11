import { ActionRowBuilder, ComponentType, Interaction, StringSelectMenuBuilder } from "discord.js";
import { InteractionCreateListener } from "../../../feature/base/interaction-create-listener";
import { isFeatureDisabled } from "../../../utils/is-feature-disabled";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "./utils/candle-money";
import { pageLimit } from "./utils/limit";
import { getBucketFishes } from "./utils/get-bucket-fishes";

export class SellListener extends InteractionCreateListener {
  public async action(interaction: Interaction): Promise<void> {
    // Cek interaction dapat dibalas
    if (!interaction.isRepliable()) return;

    // Cek fitur dimatikan
    if (await isFeatureDisabled("Fishing")) return;

    // Dapatkan config
    const config = await prisma.config.findUnique({
      where: {
        id: 1,
      },
      select: {
        fishingChannel: true
      }
    })
    if (!config) return;

    // Harus dari channel change nickname
    if (interaction.channelId !== config.fishingChannel) return;

    // Harus bukan bot
    if (interaction.user.bot) return;

    // Harus button
    if (!interaction.isButton()) return;

    const customId = interaction.customId;
    if (!customId.startsWith('sell-')) return;

    // Dapatkan ikan
    const fishes = await getBucketFishes(interaction.user.id, parseInt(customId.split('-')[1]));

    // kalo ikan kosong
    if (fishes.paged.length === 0) {
      await interaction.update({
        content: "Tidak ada ikan",
        embeds: [],
        components: []
      });
      return;
    }

    // Selection
    const select = new StringSelectMenuBuilder()
      .setCustomId(interaction.id)
      .setOptions(fishes.paged.map(data => ({
        label: data.fish.name,
        value: data.id.toString(),
      })))
      .setPlaceholder('Pilih ikan dijual')
      .setMinValues(1)
      .setMaxValues(pageLimit);

    const row = new ActionRowBuilder()
      .addComponents(select);

    const reply = await interaction.update({
      content: "Pilih ikan yang ingin kamu jual",
      components: [row as any],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: i => (i.user.id === interaction.user.id) && (i.customId === interaction.id),
      time: 120_000,
    });

    collector.on('collect', async i => {
      try {
        const result = i.values.map(value => fishes.paged.find(fish => fish.id.toString() === value)).filter(val => val !== undefined);
        const candle = result.reduce((total, data) => total + data.fish.price * data.quantity, 0);

        await prisma.$transaction(async prisma => {
          await prisma.bucket.deleteMany({
            where: {
              userId: interaction.user.id,
              id: {
                in: result.map(data => data.id)
              }
            }
          });

          await prisma.wallet.update({
            where: {
              userId: interaction.user.id
            },
            data: {
              amount: {
                increment: candle
              },
              updateAt: new Date()
            },
          });
        });

        await interaction.deleteReply();

        if (i.channel && i.channel.isSendable()) {
          await i.channel.send(`<@${i.user.id}> menjual beberapa ikan dan mendapatkan ${candleMoney(candle)}`);
        }

        await i.deleteReply();

      } catch {
        //
      } finally {
        collector.removeAllListeners();
        collector.stop();
      }
    });
  }
}