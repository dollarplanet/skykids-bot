import { OmitPartialGroupDMChannel, Message, EmbedBuilder } from "discord.js";
import { FishingActionBase } from "./fishing-action-base";
import { randomPicker } from "../utils/random-picker";
import { getCurrentFishes } from "../utils/get-current-fishes";
import { candleMoney } from "../utils/candle-money";
import { rarity } from "@prisma/xxx-client"
import { shuffle } from "../../../utils/shuffle";
import { prisma } from "../../../singleton/prisma-singleton";

type Possibility = "Ikan" | "Sampah" | "Tanaman";

export class FishNow extends FishingActionBase {
  public commands: string[] = ["mancing"];

  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
    // dapatkan peluang
    const possibility: Possibility[] = [
      "Ikan",
      "Sampah",
      "Tanaman",
    ]

    const randomPossibility = randomPicker(possibility);

    if (randomPossibility !== "Ikan") {
      await data.reply(`Kamu mendapatkan ${randomPossibility}`);
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

    // Kirim ikan
    await data.reply({
      content: "Kamu mendapatkan ikan!",
      embeds: [new EmbedBuilder()
        .setTitle(pickedFish.name)
        .setThumbnail(pickedFish.image)
        // .setDescription(`Jam: ${fish.time.join(", ")}\nBulan: ${fish.months.join(", ")}`)
        .addFields({
          name: "Rarity",
          value: pickedFish.rarity,
          inline: true,
        })
        .addFields({
          name: "Harga",
          value: candleMoney(pickedFish.price),
          inline: true,
        })
      ],
    });

    // Masukan ikan ke ember
    if (!data.member) return;
    const fingerprint = data.member.id + "-" + pickedFish.id.toString();
    await prisma.bucket.upsert({
      where: {
        id: fingerprint,
      },
      create: {
        id: fingerprint,
        userId: data.member.id,
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
  }
}