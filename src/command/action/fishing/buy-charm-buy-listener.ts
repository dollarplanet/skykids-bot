import { EmbedBuilder, Interaction } from "discord.js";
import { InteractionCreateListener } from "../../../feature/base/interaction-create-listener";
import { prisma } from "../../../singleton/prisma-singleton";
import { isFeatureDisabled } from "../../../utils/is-feature-disabled";
import { candleMoney } from "./utils/candle-money";

export class BuyCharmBuyListener extends InteractionCreateListener {
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

    // Harus dari channel
    if (interaction.channelId !== config.fishingChannel) return;

    // Harus bukan bot
    if (interaction.user.bot) return;

    // Harus button
    if (!interaction.isButton()) return;

    const customId = interaction.customId;
    if (!customId.startsWith('charm_buy-')) return;

    const currentId = parseInt(customId.split('-')[1]);

    // Cek apakah sudah punya charm
    const charmState = await prisma.charmState.findUnique({
      where: {
        userId: interaction.user.id
      },
      include: {
        charm: true
      }
    })

    if (charmState && charmState.energy > 0) {
      await interaction.update({
        content: "Kamu sudah punya jimat! Gunakan command /bantuan untuk membaca cara bermain.",
        components: [],
        embeds: [new EmbedBuilder()
          .setTitle(charmState.charm!.name)
          .setThumbnail(charmState.charm!.image)
          .setColor("Orange")
          .addFields({
            name: "Harga",
            value: candleMoney(charmState.charm!.price),
            inline: true,
          })
          .addFields({
            name: "Sisa Pakai",
            value: `${charmState.energy} kali`,
            inline: true,
          })
          .addFields({
            name: "Keberuntungan",
            value: `+ ${charmState.charm!.luckyPercentAdded}%`,
            inline: true,
          }),
        ],
      });
      return;
    }

    // Dapatkan charm
    const charm = await prisma.charm.findUnique({
      select: {
        id: true,
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

    // Dapatkan wallet
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: interaction.user.id
      },
      select: {
        amount: true,
      }
    });

    // Jika belum punya wallet
    if (!wallet) {
      await interaction.update({
        content: "Dompet kamu masih kosong. Baca cara bermain dengan command /bantuan.",
        embeds: [],
        components: [],
      });
      return;
    }

    // Jika uang kurang
    if (wallet.amount < charm.price) {
      await interaction.update({
        content: "Candle kamu tidak cukup. Gunakan command /kerja atau /mulung untuk mendapatakan candle tamabahan. Kamu juga bisa menjual beberapa ikan di /ember.",
        embeds: [],
        components: [],
      });
      return;
    }

    // Update database
    await prisma.$transaction(async (tx) => {
      // Kurangi wallet
      await tx.wallet.update({
        where: {
          userId: interaction.user.id
        },
        data: {
          amount: {
            decrement: charm.price
          },
          all: {
            decrement: charm.price
          }
        }
      });

      // Tambah charm
      await tx.charmState.upsert({
        where: {
          userId: interaction.user.id
        },
        update: {
          energy: charm.defaultEnergy,
          updateAt: new Date(),
          charmId: charm.id,
        },
        create: {
          userId: interaction.user.id,
          charmId: charm.id,
          energy: charm.defaultEnergy
        }
      });
    })

    // Reply
    await interaction.deferUpdate();
    await interaction.deleteReply();
    if (!interaction.channel?.isSendable()) return;
    await interaction.channel.send({
      content: `<@${interaction.user.id}> membeli jimat baru`,
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
    });
  }
}