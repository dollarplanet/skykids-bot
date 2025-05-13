import { Interaction } from "discord.js";
import { CommandBase } from "../command-base";
import { prisma } from "../../../singleton/prisma-singleton";

export class HelpCommand extends CommandBase {
  protected name: string = "bantuan";
  protected description: string = "Lihat cara bermain";

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

    await interaction.reply(`***Fungsi Command***

**/kerja**
Dapatkan penghasilan tambahan dengan bekerja. Kamu bisa bekerja sehari sekali. jam reset sesuai jam reset sky.

**/mulung**
Dapatkan penghasilan tambahan dengan memulung barang - barang bekas. Dapat dilakukan 5 menit sekali.

**/joran**
Beli joran untuk memancing.

**/mancing**
Lempar joran dan mulai memancing.

**/ember**
Lihat semua ikan hasil tangkapan kamu disini. Kamu juga bisa menjual ikan melalui menu ini.

**/jual-duplikat**
Jual semua ikan yang duplikat dan sisakan masing - masing 1 ekor untuk koleksi. 

**/peluang**
Dapatkan info peluang ikan yang akan di dapatkan. Jenis ikan yang berbeda memiliki musim dan jam makan yang berbeda.

**/dompet**
Lihat total candle yang kamu punya, termasuk harga ikan yang belum dijual.

**/pamer**
Pamerin 3 ikan terbaikmu.

**/peringkat**
Lihat peringkat mancing mania.

**/bantuan**
Lihat cara bermain.
`);
  }
}