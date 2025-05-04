import { Message, MessageCreateOptions, OmitPartialGroupDMChannel } from "discord.js";
import { MessageCreateListener } from "../base/message-create-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";


export class WelcomeBannerForward extends MessageCreateListener {
  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
      const botWelcomeChannelId = "1360680484102738012";
      const welcomeChannelId = "1362375074270675074";

      // Cek fitur dimatikan
      if (await isFeatureDisabled("WelcomeBannerForward")) return;

      // Pesan harus berasal dari bot welcome channel
      if (data.channelId !== botWelcomeChannelId) return;

      // Mendapatkan real welcome channel
      const welcomeChannel = data.guild?.channels.cache.get(welcomeChannelId);
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