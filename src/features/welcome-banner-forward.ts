import { Message, MessageCreateOptions, OmitPartialGroupDMChannel } from "discord.js";
import { MessageCreateFeatureBase } from "./feature-base";


export class WelcomeBannerForward extends MessageCreateFeatureBase {
  private botWelcomeChannelId = "1360680484102738012";
  private welcomeChannelId = "1362375074270675074";

  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>) {
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
  }
}