import { AnyThreadChannel, ChannelType } from "discord.js";
import { ThreadFeatureBase } from "./feature-base";

export class MediaOnlyForum extends ThreadFeatureBase {
  // Register channel here
  private channelIds: string[] = process.env.MEDIA_ONLY_CHANNELS!.split(" ");

  public async action(channel: AnyThreadChannel, _: boolean) {
    // Cek channel harus type forum
    if (channel.parent?.type !== ChannelType.GuildForum) return;

    // Channel id harus terdaftar di list
    if (!this.channelIds.includes(channel.parent?.id)) return;

    // Dapetin postingan
    const messages = await channel.messages.fetch();
    const post = messages.first();

    // Kembali jika postingan undefined
    if (!post) return;

    // Postingan harus hanya berisi attachement foto/video
    if ([...post.attachments].length > 0) {
      const contentTypes = post.attachments.map(attachement => attachement.contentType);

      let hasNonPhotoVideo = false;
      contentTypes.forEach(contentType => {
        const isImageOrVideo = contentType?.includes("image") || contentType?.includes("video");
        hasNonPhotoVideo = !isImageOrVideo;
      })

      if (!hasNonPhotoVideo) return;
    };

    // Hapus postingan
    await channel.delete();

    // Kirim reminder
    await post.author.send(`Halo ${post.author.globalName} 😊, Untuk membuat postingan di channel ${channel.parent.name}, kamu perlu menyertakan foto atau video, dan tidak boleh menyertakan jenis file lainnya. Maaf, postingan kamu sebelumnya terpaksa aku hapus ya 😢.`)
  }
}