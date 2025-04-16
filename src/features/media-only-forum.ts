import { AnyThreadChannel, ChannelType } from "discord.js";
import { ThreadFeatureBase } from "./feature-base";

export class MediaOnlyForum extends ThreadFeatureBase {
  // Register channel here
  private channelIds: string[] = [
    "1361927984193212537"
  ]

  public async action(channel: AnyThreadChannel) {
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
  }
}