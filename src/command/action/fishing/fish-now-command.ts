import { EmbedBuilder, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { randomPicker } from "./utils/random-picker";
import { candleMoney } from "./utils/candle-money";
import { getCurrentFishes } from "./utils/get-current-fishes";
import { shuffle } from "../../../utils/shuffle";
import { prisma } from "../../../singleton/prisma-singleton";
import { getBucketFishes } from "./utils/get-bucket-fishes";
import dayjs from "dayjs";
import { RiskManagement } from "./utils/risk-management";
import { RarityManagement } from "./utils/rarity-management";
import { nameBadgeUpdate } from "../../../utils/name-badge-update";

export class FishNowCommand extends CommandBase {
  protected name: string = "mancing";
  protected description: string = "Lempar joran untuk mulai memancing";

  public async action(interaction: Interaction): Promise<void> {

    // Cek apakah bisa di reply
    if (!interaction.isRepliable()) return;

    try {
      // Defer
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral
      });

      // pastikan dari fishing channel
      const channel = await prisma.config.findUnique({
        where: {
          id: 1,
        },
        select: {
          fishingChannel: true
        }
      });
      if (interaction.channelId !== channel?.fishingChannel) throw new Error();

      // Cek joran
      const rodState = await prisma.rodState.findUnique({
        where: {
          userId: interaction.user.id
        },
        select: {
          lastFish: true,
          energy: true,
          rod: true
        }
      })

      // Jika tidak punya joran
      if (!rodState?.rod) {
        await interaction.editReply({
          content: "Kamu harus memiliki 🎣 joran untuk memancing! Gunakan command /joran untuk membeli 🎣 joran. Gunakan command /bantuan untuk membaca cara bermain.",
        });
        return;
      }

      // Jika energy habis
      if (rodState.energy <= 0) {
        await interaction.editReply({
          content: "Joran kamu sudah rusak! Gunakan command /joran untuk membeli joran lagi.",
          embeds: [new EmbedBuilder()
            .setTitle(rodState.rod.name)
            .setThumbnail(rodState.rod.image)
            .setColor("Orange")
            .addFields({
              name: "Harga",
              value: candleMoney(rodState.rod.price),
              inline: true,
            })
            .addFields({
              name: "Kekuatan",
              value: `${rodState.energy} tarikan`,
              inline: true,
            })
            .addFields({
              name: "Ikan Langka",
              value: rodState.rod.possibilityPercentAdded === 0 ? "Basic" : `+ ${rodState.rod.possibilityPercentAdded}%`,
              inline: true,
            }),
          ],
        });
        return;
      }

      // Tunggu 1 menit
      if (rodState.lastFish) {
        const diff = dayjs().diff(dayjs(rodState.lastFish), "seconds");
        if (diff < 60) {
          await interaction.editReply({
            content: `<@${interaction.user.id}> Umpannya lagi dipasang, tunggu sekitar ${60 - diff} detik lagi.`,
          });
          return;
        }
      }

      // Kurangi energy joran
      await prisma.rodState.update({
        where: {
          userId: interaction.user.id,
        },
        data: {
          energy: {
            decrement: 1
          },
          lastFish: dayjs().toDate(),
          updateAt: new Date()
        }
      })

      // Dapatkan dompet
      const wallet = await prisma.wallet.findUnique({
        where: {
          userId: interaction.user.id
        },
        select: {
          all: true,
        }
      })

      // Dapatkan charm
      const charmState = await prisma.charmState.findUnique({
        where: {
          userId: interaction.user.id
        },
        select: {
          charm: true,
          energy: true
        }
      })

      const currentCharm = (charmState && (charmState.energy > 0)) ? charmState.charm : null;

      if (currentCharm) {
        if (charmState?.energy === 1) {
          // hapus charm
          await prisma.charmState.delete({
            where: {
              userId: interaction.user.id
            }
          })
        } else {
          // Kurangi energy charm
          await prisma.charmState.update({
            where: {
              userId: interaction.user.id,
            },
            data: {
              energy: {
                decrement: 1
              },
              updateAt: new Date()
            }
          })
        }
      }

      // risk management
      const risk = new RiskManagement(wallet?.all ?? 0, currentCharm);

      // additional embeds
      const additionalEmbeds: EmbedBuilder[] = [];

      if (rodState.energy === 1) {
        additionalEmbeds.push(new EmbedBuilder()
          .setDescription(`${rodState.rod.name} kamu rusak! Beli joran lagi dengan command /joran`)
          .setColor("Red")
        );
      }

      if (currentCharm && (charmState?.energy === 1)) {
        additionalEmbeds.push(new EmbedBuilder()
          .setDescription(`Jimat ${currentCharm.name} kamu rusak!`)
          .setColor("Red")
        );
      }

      if (!interaction.channel?.isSendable()) throw new Error();

      // apakah dapat sampah?
      if (risk.result === "Gagal") {
        await interaction.channel.send({
          content: `Yah, <@${interaction.user.id}> dapat sampah. Buang saja ya!`,
          embeds: [new EmbedBuilder()
            .setTitle("Sampah")
            .setThumbnail("https://dodo.ac/np/images/e/ed/Green_Ring_Shirt_PG_Model.png")
            .setColor("#e63946")
            .addFields({
              name: "Harga",
              value: candleMoney(0),
              inline: true,
            }),
          ...additionalEmbeds
          ],
        });
        throw new Error();
      }

      // Dapatkan ikan
      const fishes = await getCurrentFishes();

      // rarity management
      const rarity = new RarityManagement(rodState.rod);

      const multipleFish = fishes.map(fish => {
        const temp = [fish];
        const count = rarity.result(fish.rarity);

        for (let i = 1; i < count; i++) {
          temp.push(fish);
        }

        return temp;
      }).flat();

      const pickedFish = randomPicker<typeof multipleFish[0]>(shuffle<typeof multipleFish[0]>(multipleFish));

      // Lihat keberuntungan
      const luck = risk.luck;

      if (luck === "Gagal") {
        // Dapatkan musibah dari db
        const accidents = await prisma.accident.findMany({
          select: {
            description: true
          }
        });

        const accident = randomPicker(accidents);

        await interaction.channel.send({
          content: `<@${interaction.user.id}> sayang sekali, kamu mengalami musibah`,
          embeds: [new EmbedBuilder()
            .setTitle("Musibah")
            .setDescription(accident.description)
            .setThumbnail(pickedFish.image)
            .setColor("Red")
            .addFields({
              name: "Ikan",
              value: `${pickedFish.name} (${pickedFish.rarity})`,
              inline: true,
            }),
          ...additionalEmbeds
          ],
        })
        throw new Error();
      }


      await prisma.$transaction(async prisma => {
        // update charm
        const updateData = (charmState !== null) ? {
          quantity: {
            increment: 1,
          },
          rodId: rodState.rod?.id ?? 1,
          updateAt: new Date(),
          charmId: currentCharm!.id,
        } : {
          quantity: {
            increment: 1,
          },
          rodId: rodState.rod?.id ?? 1,
          updateAt: new Date(),
        }

        // Masukan ikan ke ember
        if (!interaction.member) throw new Error();
        const fingerprint = interaction.user.id + "-" + pickedFish.id.toString();
        await prisma.bucket.upsert({
          where: {
            fingerprint: fingerprint,
          },
          create: {
            fingerprint: fingerprint,
            userId: interaction.user.id,
            fishId: pickedFish.id,
            quantity: 1,
            rodId: rodState.rod?.id ?? 1,
            charmId: currentCharm?.id ?? null,
          },
          update: updateData
        })

        // dapatkan current wallet
        const wallet = await prisma.wallet.findUnique({
          where: {
            userId: interaction.user.id,
          },
          select: {
            amount: true,
          }
        });

        // Dapatkan total ikan di ember
        const bucketFishes = await getBucketFishes(interaction.user.id, 0);
        const totalFishesPrice = bucketFishes.all.reduce((total, fish) => {
          return total + (fish.fish.price * fish.quantity);
        }, 0) + pickedFish.price;

        // Update wallet
        await prisma.wallet.upsert({
          where: {
            userId: interaction.user.id,
          },
          update: {
            all: totalFishesPrice + (wallet?.amount ?? 0),
            updateAt: new Date()
          },
          create: {
            userId: interaction.user.id,
            all: totalFishesPrice + (wallet?.amount ?? 0)
          }
        });
      });

      // update username
      const guildMember = interaction.guild?.members.cache.get(interaction.user.id);
      if (guildMember) {
        await nameBadgeUpdate(guildMember);
      }

      await interaction.deleteReply();

      // Kirim ikan
      await interaction.channel.send({
        content: `<@${interaction.user.id}> mendapatkan ikan!`,
        embeds: [new EmbedBuilder()
          .setTitle(pickedFish.name)
          .setDescription(`Menggunakan ${rodState.rod.name} ${(currentCharm !== null) ? `dan Jimat ${currentCharm.name}` : ""}`)
          .setThumbnail(pickedFish.image)
          .setColor("#008000")
          .addFields({
            name: "Harga",
            value: candleMoney(pickedFish.price) + ` (${pickedFish.rarity})`,
            inline: true,
          }),
        ...additionalEmbeds
        ],
      });
    } catch {
      await interaction.deleteReply();
    }
  }
}