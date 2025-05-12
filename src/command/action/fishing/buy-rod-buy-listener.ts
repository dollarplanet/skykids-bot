import { EmbedBuilder, Interaction } from "discord.js";
import { InteractionCreateListener } from "../../../feature/base/interaction-create-listener";
import { prisma } from "../../../singleton/prisma-singleton";
import { isFeatureDisabled } from "../../../utils/is-feature-disabled";
import { candleMoney } from "./utils/candle-money";

export class BuyRodBuyListener extends InteractionCreateListener {
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
    if (!customId.startsWith('joran_buy-')) return;

    const currentId = parseInt(customId.split('-')[1]);

    // Cek apakah sudah punya joran
    const rodState = await prisma.rodState.findUnique({
      where: {
        userId: interaction.user.id
      },
      include: {
        rod: true
      }
    })

    if (rodState) {
      if (rodState.energy > 0) {
        await interaction.update({
          content: "Kamu sudah punya joran! Gunakan command /mancing untuk memancing! Gunakan command /bantuan untuk membaca cara bermain.",
          components: [],
          embeds: [new EmbedBuilder()
            .setTitle(rodState.rod!.name)
            .setThumbnail(rodState.rod!.image)
            .setColor("Orange")
            .addFields({
              name: "Harga",
              value: candleMoney(rodState.rod!.price),
              inline: true,
            })
            .addFields({
              name: "Kekuatan",
              value: `${rodState.energy} tarikan`,
              inline: true,
            })
            .addFields({
              name: "Peluang",
              value: rodState.rod!.possibilityPercentAdded === 0 ? "Basic" : `+ ${rodState.rod!.possibilityPercentAdded}%`,
              inline: true,
            })],
        });
        return;
      }

      // Kalo masih ada tapi energy kosong, hapus
      await prisma.rodState.delete({
        where: {
          userId: interaction.user.id
        }
      });
    }

    // Dapatkan joran
    const rod = await prisma.rod.findUnique({
      select: {
        id: true,
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
    if (wallet.amount < rod.price) {
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
            decrement: rod.price
          },
          all: {
            decrement: rod.price
          }
        }
      });

      // Tambah joran
      await tx.rodState.create({
        data: {
          userId: interaction.user.id,
          rodId: rod.id,
          energy: rod.defaultEnergy
        }
      });
    })

    // Reply
    await interaction.update({
      content: "Done",
      embeds: [],
      components: [],
    });
    await interaction.deleteReply();
    if (!interaction.channel?.isSendable()) return;
    await interaction.channel.send({
      content: `<@${interaction.user.id}> membeli joran baru>`,
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
    });
  }
}