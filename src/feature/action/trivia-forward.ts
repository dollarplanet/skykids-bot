import { ActionRowBuilder, Message, OmitPartialGroupDMChannel, StringSelectMenuBuilder } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { prisma } from "../../singleton/prisma-singleton";
import { shuffle } from "../../utils/shuffle";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";
import { MessageCreateListener } from "../base/message-create-listener";

export class TriviaForward extends MessageCreateListener {
  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
      // Apakah fitur aktif
      if (await isFeatureDisabled("Trivia")) return;

      // Dapatkan config
      const config = await prisma.config.findUnique({
        where: {
          id: 1,
        },
        select: {
          triviaChannel: true,
          triviaIndonesiaChannel: true
        }
      })
      if (!config?.triviaChannel) return;
      if (!config?.triviaIndonesiaChannel) return;

      // Harus trivia channel
      if (data.channelId !== config.triviaIndonesiaChannel) return;

      // Update trivia
      const questionIndo = data.content.split("\n")[1].replace("> ", "");
      const triviaId = parseInt(data.content.split("\n")[2]);
      console.log(triviaId, questionIndo);
      const trivia = await prisma.trivia.update({
        where: {
          id: triviaId,
        },
        data: {
          questionIndo: questionIndo,
          updateAt: new Date()
        },
        select: {
          id: true,
          question: true,
          correctAnswer: true,
          category: true,
          optionOne: true,
          optionTwo: true,
          optionThree: true,
          questionIndo: true,
        }
      });
      // Dapatkan trivia channel
      const channel = await discord().channels.fetch(config.triviaChannel);
      if (!channel) return;

      // Cek sendable
      if (!channel.isSendable()) return;

      // Answer option
      const answerOptions: string[] = shuffle<string>([
        trivia.correctAnswer,
        trivia.optionOne,
        trivia.optionTwo ?? "",
        trivia.optionThree ?? "",
      ]);

      // Selector
      const select = new StringSelectMenuBuilder()
        .setCustomId(`trivia-${trivia.id}`)
        .setPlaceholder('Pilih Jawaban')
        .setOptions(answerOptions.map(answer => ({
          label: answer,
          value: answer,
          default: false
        })))

      const row = new ActionRowBuilder()
        .addComponents(select);

      // Kirim trivia
      const message = await channel.send({
        content: `*Kategori ${trivia.category}*

**${trivia.question}**
*"${trivia.questionIndo}"*
  
Jawaban kamu :`,
        components: [row as any],
      });

      // Create thread
      if (message.hasThread) return;
      await message.startThread({ name: "ᴛʀɪᴠɪᴀ" });
    } catch {
      //
    }
  }
}