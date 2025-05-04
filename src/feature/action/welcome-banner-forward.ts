import { Message, MessageCreateOptions, OmitPartialGroupDMChannel } from "discord.js";
import { MessageCreateListener } from "../base/message-create-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";


export class WelcomeBannerForward extends MessageCreateListener {
  private botWelcomeChannelId = "1360680484102738012";
  private welcomeChannelId = "1362375074270675074";

  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
      // Cek fitur diaktifkan
      if (await isFeatureDisabled("WelcomeBannerForward")) return;

      // Pesan harus berasal dari bot welcome channel
      if (data.channelId !== this.botWelcomeChannelId) return;

      // Mendapatkan real welcome channel
      const welcomeChannel = data.guild?.channels.cache.get(this.welcomeChannelId);
      if (!welcomeChannel) return;

      // Kirim pesan ke welcome channel
      if (welcomeChannel.isSendable()) {
        const payload: MessageCreateOptions = {
          content: data.content,
          files: data.attachments.map(attachement => attachement.url),
        }

        await welcomeChannel.send(payload)
      }
    } catch {
      //
    }
  }
}