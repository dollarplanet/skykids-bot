import { EmbedBuilder, Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "../command-base";
import { randomPicker } from "./utils/random-picker";
import { candleMoney } from "./utils/candle-money";
import { getCurrentFishes } from "./utils/get-current-fishes";
import { rarity } from "@prisma/xxx-client"
import { shuffle } from "../../../utils/shuffle";
import { prisma } from "../../../singleton/prisma-singleton";
import { getBucketFishes } from "./utils/get-bucket-fishes";
import dayjs from "dayjs";
import { RiskManagement } from "./utils/risk-management";

export class FishNowCommand extends CommandBase {
  protected name: string = "mancing";
  protected description: string = "Lempar joran untuk mulai memancing";

  public async action(interaction: Interaction): Promise<void> {
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
      await interaction.reply({
        content: "Kamu harus memiliki 🎣 joran untuk memancing! Gunakan command /joran untuk membeli 🎣 joran. Gunakan command /bantuan untuk membaca cara bermain.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // Jika energy habis
    if (rodState.energy <= 0) {
      await interaction.reply({
        content: "Joran kamu sudah rusak! Gunakan command /joran untuk membeli joran lagi.",
        flags: MessageFlags.Ephemeral,
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
            name: "Peluang",
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
        await interaction.reply({
          content: `<@${interaction.user.id}> Umpannya lagi dipasang, tunggu sekitar ${60 - diff} detik lagi.`,
          flags: MessageFlags.Ephemeral,
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

    // Garansi dapat ikan untuk candle dibawah 1000
    const risk = new RiskManagement(wallet?.all ?? 0, rodState.rod);

    if (risk.result === "Gagal") {
      await interaction.reply({
        content: `Yah, <@${interaction.user.id}> dapat sampah. Buang saja ya!`,
        embeds: [new EmbedBuilder()
          .setTitle("Sampah")
          .setThumbnail("https://dodo.ac/np/images/e/ed/Green_Ring_Shirt_PG_Model.png")
          .setColor("#e63946")
          .addFields({
            name: "Harga",
            value: candleMoney(0),
            inline: true,
          })
        ],
      });
      return;
    }

    // Dapatkan ikan
    const fishes = await getCurrentFishes();

    // Shuffle ikan berdasarkan rarity
    const multipleValue = new Map<rarity, number>();
    multipleValue.set(rarity.VeryCommon, 10);
    multipleValue.set(rarity.Common, 9);
    multipleValue.set(rarity.Uncommon, 6);
    multipleValue.set(rarity.Rare, 3);
    multipleValue.set(rarity.VeryRare, 1);

    const multipleFish = fishes.map(fish => {
      const temp = [fish];
      const count = (multipleValue.get(fish.rarity) ?? 1) - 1;

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

      await interaction.reply({
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
          })
        ],
      })
      return;
    }


    await prisma.$transaction(async prisma => {
      // Masukan ikan ke ember
      if (!interaction.member) return;
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
        },
        update: {
          quantity: {
            increment: 1,
          },
          rodId: rodState.rod?.id ?? 1,
          updateAt: new Date(),
        }
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

    // Kirim ikan
    await interaction.reply({
      content: `<@${interaction.user.id}> mendapatkan ikan!`,
      embeds: [new EmbedBuilder()
        .setTitle(pickedFish.name)
        .setDescription(`Menggunakan ${rodState.rod.name}`)
        .setThumbnail(pickedFish.image)
        .setColor("#008000")
        .addFields({
          name: "Harga",
          value: candleMoney(pickedFish.price) + ` (${pickedFish.rarity})`,
          inline: true,
        })
      ],
    });
  }
}