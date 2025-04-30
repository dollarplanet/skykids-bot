import { OmitPartialGroupDMChannel, Message, MessageCreateOptions } from "discord.js";
import { MessageCreateListener } from "../base/message-create-listener";

export class DailyQuestionForward extends MessageCreateListener {
  private dailyQuestionChannelId = "1362320556162158603";
  private elderChannelId = "1362338943005229137";

  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
      // Harus dari channel daily question
      if (data.channelId !== this.dailyQuestionChannelId) return;

      // Get description
      const description = data.embeds[0].description;
      if (!description) return;

      // Get elder channel
      const elderChannel = data.guild?.channels.cache.get(this.elderChannelId);
      if (!elderChannel) return;

      // Payload
      const payload: MessageCreateOptions = {
        content: "🤔",
      }

      // Kirim pesan ke elder channel
      if (elderChannel.isThreadOnly()) {
        await elderChannel.threads.create({
          name: description,
          message: payload
        });
      }
    } catch {
      //
    }
  }

}