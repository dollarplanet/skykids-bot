import { OmitPartialGroupDMChannel, Message, EmbedBuilder } from "discord.js";
import { FishingActionBase } from "./fishing-action-base";
import { candleMoney } from "../utils/candle-money";
import { getCurrentFishes } from "../utils/get-current-fishes";

export class FishOpportunities extends FishingActionBase {
  public commands: string[] = ["peluang"];

  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
    // dapatkan ikan 
    const fishes = await getCurrentFishes();

    // kalo ikan kosong
    if (fishes.length === 0) {
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
    for (let i = 0; i < fishes.length; i += 10) {
      const fishesCopy = fishes.slice(i, i + 10);
      await thread.send({
        embeds: fishesCopy.map(fish => {
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