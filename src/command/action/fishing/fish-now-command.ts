import { EmbedBuilder, Interaction } from "discord.js";
import { CommandBase } from "../command-base";
import { randomPicker } from "./utils/random-picker";
import { candleMoney } from "./utils/candle-money";
import { getCurrentFishes } from "./utils/get-current-fishes";
import { rarity } from "@prisma/xxx-client"
import { shuffle } from "../../../utils/shuffle";
import { prisma } from "../../../singleton/prisma-singleton";
import { getBucketFishes } from "./utils/get-bucket-fishes";

type Possibility = "Ikan" | "Sampah" | "Tanaman";

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

    // dapatkan peluang
    const possibility: Possibility[] = [
      "Ikan",
      "Sampah",
      "Ikan",
      "Tanaman",
    ]

    const randomPossibility = randomPicker(possibility);

    if (randomPossibility === "Tanaman") {
      await interaction.reply({
        content: `<@${interaction.user.id}> mendapatkan tumbuhan air! Sayang sekali tidak bisa dijual.`,
        embeds: [new EmbedBuilder()
          .setTitle("Tumbuhan Air")
          .setThumbnail("https://dodo.ac/np/images/8/8c/Seaweed_NH_Icon.png")
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

    if (randomPossibility === "Sampah") {
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
      },
      update: {
        quantity: {
          increment: 1,
        },
        updateAt: new Date(),
      }
    })

    // Dapatkan total ikan di ember
    const bucketFishes = await getBucketFishes(interaction.user.id, 0);
    const totalFishesPrice = bucketFishes.all.reduce((total, fish) => {
      return total + (fish.fish.price * fish.quantity);
    }, 0)

    // Update wallet
    await prisma.wallet.upsert({
      where: {
        userId: interaction.user.id,
      },
      update: {
        all:  totalFishesPrice
      },
      create: {
        userId: interaction.user.id,
        all: totalFishesPrice
      }
    });

    // Kirim ikan
    await interaction.reply({
      content: `<@${interaction.user.id}> mendapatkan ikan!`,
      embeds: [new EmbedBuilder()
        .setTitle(pickedFish.name)
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