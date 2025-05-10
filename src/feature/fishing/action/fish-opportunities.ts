import { OmitPartialGroupDMChannel, Message, EmbedBuilder } from "discord.js";
import { FishingActionBase } from "./fishing-action-base";
import dayjs from "dayjs";
import { prisma } from "../../../singleton/prisma-singleton";
import { candleMoney } from "../utils/candle-money";

export class FishOpportunities extends FishingActionBase {
  public commands: string[] = ["peluang"];

  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
    // dapatkan jam dan bulan
    const now = dayjs().tz('Asia/Jakarta').locale('id');
    const hour = now.hour();
    const month = now.month() + 1;

    // dapatkan ikan sesuai waktu
    const fishs = await prisma.fish.findMany({
      select: {
        name: true,
        image: true,
        rarity: true,
        price: true,
        time: true,
        months: true
      },
      where: {
        time: {
          has: hour,
        },
        months: {
          has: month,
        },
      },
      orderBy: {
        price: "asc",
      },
    })

    // kalo ikan kosong
    if (fishs.length === 0) {
      await data.reply("Tidak ada ikan untuk saat ini :(");
      return;
    }

    // buat thread untuk jawaban
    const thread = await data.startThread({
      name: "Peluang Ikan",
      autoArchiveDuration: 60,
    })

    // pesan pengantar
    await thread.send({
      content: "Ikan - ikan yang berbeda hanya bisa dipancing pada jam dan bulan tertentu. Untuk waktu saat ini, kamu berpeluang mendaptakan ikan di bawah ini.",
    })

    // kalo ikan ada
    for (let i = 0; i < fishs.length; i += 10) {
      const fishsCopy = fishs.slice(i, i + 10);
      await thread.send({
        embeds: fishsCopy.map(fish => {
          return new EmbedBuilder()
            .setTitle(fish.name)
            .setThumbnail(fish.image)
            // .setDescription(`Jam: ${fish.time.join(", ")}\nBulan: ${fish.months.join(", ")}`)
            .addFields({
              name: "Rarity",
              value: fish.rarity,
              inline: true,
            })
            .addFields({
              name: "Harga",
              value: candleMoney(fish.price),
              inline: true,
            })
        }),
      });
    }


  }
}