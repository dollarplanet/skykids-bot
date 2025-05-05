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
      // Sudah menjawab benar
      const isAnsweredCorrect = await prisma.triviaUserAnswer.count({
        where: {
          triviaId: triviaId,
          userId: interaction.user.id,
          correct: true,
        }
      });
      if (isAnsweredCorrect > 0) {
        interaction.reply({
          content: 'Kamu udah menjawab benar, tidak perlu menjawab lagi 😎',
          flags: MessageFlags.Ephemeral,
        })
        return;
      }

      // Sudah menjawab 2x
      const isAnswered = await prisma.triviaUserAnswer.count({
        where: {
          triviaId: triviaId,
          userId: interaction.user.id,
        }
      });
      if (isAnswered > 1) {
        interaction.reply({
          content: 'Maaf nih, Kamu udah dikasih kesempatan 2 kali 😌',
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
          question: true,
          questionIndo: true,          
        }
      });
      if (!trivia) return;

      // Cek jawaban
      const value: string = interaction.values[0];
      const thread = interaction.message.thread;
      if (!thread) return;

      const isCorrect = value === trivia.correctAnswer;
      if (isCorrect) {
        // Kalo jawaban benar
        thread.send(`✅ Jawaban <@!${interaction.user.id}> benar! 🥳`);
        interaction.reply({
          content: `✅ Jawaban kamu benar! 
          
Sssst 🤫, jangan kasih tau yang lain ya 🤭`,
          flags: MessageFlags.Ephemeral,
        })
      } else if (isAnswered === 0) {
        // Kalo jawaban salah 1x
        thread.send(`❌ Jawaban <@!${interaction.user.id}> salah 😝`);
        interaction.reply({
          content: '❌ Jawabannya salah ya 😝. Kamu masih punya kesempatan 1 kali lagi!',
          flags: MessageFlags.Ephemeral,
        })
      } else {
        // Kalo jawaban salah 2x
        thread.send(`❌ Jawaban <@!${interaction.user.id}> masih salah aja 🤣`);
        interaction.reply({
          content: '❌ Sayang sekali, kamu gagal di kesempatan terakhir 🙃. Yaudah jawabannya aku kirim lewat DM ya, biar kamu gak penasaran. 😁',
          flags: MessageFlags.Ephemeral,
        })

        // Kirim DM jawaban
        await interaction.user.send(`Halo ${interaction.user.displayName} 👋

Trivia :
**${trivia.question}**
*"${trivia.questionIndo}"*

Jawaban yang benar adalah, ***${trivia.correctAnswer}***
Jangan bosen - bosen main trivia ya ☺️`);
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