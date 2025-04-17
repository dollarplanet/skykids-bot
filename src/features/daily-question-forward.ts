import { OmitPartialGroupDMChannel, Message, MessageCreateOptions } from "discord.js";
import { MessageCreateFeatureBase } from "./feature-base";
import { readFileSync } from "fs";

export class DailyQuestionForward extends MessageCreateFeatureBase {
  private dailyQuestionChannelId = "1362320556162158603";
  private elderChannelId = "1360874619661324368";

  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>) {
    // Harus dari channel daily question
    if (data.channelId !== this.dailyQuestionChannelId) return;

    // Get content
    const content = `
    **Hey Adventurer ‼️**
    ${data.embeds[0].description}


    ᴮᵉʳᵖᵉᵗᵘᵃˡᵃⁿᵍ ᵗᵃⁿᵖᵃ ˡᵉˡᵃʰ ᵐᵉⁿᵘʲᵘ ᵘʲᵘⁿᵍ ˡᵃⁿᵍⁱᵗ
    `;
    if (!content) return;

    // Get elder channel
    const elderChannel = data.guild?.channels.cache.get(this.elderChannelId);
    if (!elderChannel) return;

    // Decoration image
    const decorImage = readFileSync("./assets/question-decor.jpg")

    // Payload
    const payload: MessageCreateOptions = {
      content: content,
      files: [
        decorImage
      ]
    }

    // Kirim pesan ke elder channel
    if (elderChannel.isSendable()) {
      await elderChannel.send(payload);
    }
  }

}