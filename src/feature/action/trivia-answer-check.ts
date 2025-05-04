import { Interaction, MessageFlags } from "discord.js";
import { InteractionCreateListener } from "../base/interaction-create-listener";
import { prisma } from "../../singleton/prisma-singleton";

export class TriviaAnswerCheck extends InteractionCreateListener {
  public async action(interaction: Interaction) {
    try {
      // Cek interaction dapat dibalas
      if (!interaction.isRepliable()) return;

      // Cek ini interaksi trivia
      if (!interaction.isAnySelectMenu()) return;
      if (!interaction.customId.startsWith('trivia-')) return;

      const triviaId = parseInt(interaction.customId.split('-')[1]);

      // Cek apakah user sudah menjawab
      const isAnswered = await prisma.triviaUserAnswer.count({
        where: {
          triviaId: triviaId,
          userId: interaction.user.id,
        }
      });
      if (isAnswered > 0) {
        interaction.reply({
          content: 'Maaf nih, Kamu hanya boleh menjawab satu kali 😌',
          flags: MessageFlags.Ephemeral,
        })
        return;
      }

      // Daptkan trivia dari database
      const trivia = await prisma.trivia.findUnique({
        where: {
          id: triviaId,
        },
        select: {
          correctAnswer: true,
        }
      });
      if (!trivia) return;

      // Cek jawaban
      const value: string = interaction.values[0];
      const thread = interaction.message.thread;
      if (!thread) return;

      const isCorrect = value === trivia.correctAnswer;
      if (isCorrect) {
        thread.send(`✅ Jawaban <@!${interaction.member?.user.id}> benar! 🥳`);
        interaction.reply({
          content: `✅ Jawaban kamu benar! 
          
Sssst 🤫, jangan kasih tau yang lain ya 🤭`,
          flags: MessageFlags.Ephemeral,
        })
      } else {
        thread.send(`❌ Jawaban <@!${interaction.member?.user.id}> salah 😝`);
        interaction.reply({
          content: '❌ Jawabannya salah ya 😝',
          flags: MessageFlags.Ephemeral,
        })
      }

      // Simpan log
      await prisma.triviaUserAnswer.create({
        data: {
          triviaId: triviaId,
          userId: interaction.user.id,
          correct: isCorrect,
          answer: value
        }
      });
    } catch {
      //
    }
  }

}