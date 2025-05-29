import { Interaction, MessageFlags } from "discord.js";
import { InteractionCreateListener } from "../base/interaction-create-listener";
import { prisma } from "../../singleton/prisma-singleton";
import { nameBadgeUpdate } from "../../utils/name-badge-update";

export class TriviaAnswerCheck extends InteractionCreateListener {
  public async action(interaction: Interaction) {
    try {
      // Cek interaction dapat dibalas
      if (!interaction.isRepliable()) return;

      // Cek ini interaksi trivia
      if (!interaction.isAnySelectMenu()) return;
      if (!interaction.customId.startsWith('trivia-')) return;

      const triviaId = parseInt(interaction.customId.split('-')[1]);

      // Defer
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral
      });

      // Sudah menjawab benar
      const isAnsweredCorrect = await prisma.triviaUserAnswer.count({
        where: {
          triviaId: triviaId,
          userId: interaction.user.id,
          correct: true,
        }
      });
      if (isAnsweredCorrect > 0) {
        await interaction.editReply({
          content: 'Kamu udah menjawab benar, tidak perlu menjawab lagi 😎',
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
        await interaction.editReply({
          content: 'Maaf nih, Kamu udah dikasih kesempatan 2 kali 😌',
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
        // Simpan state di DB
        await prisma.userStatistic.upsert({
          where: {
            userId: interaction.user.id,
          },
          create: {
            userId: interaction.user.id,
            triviaCorrectCount: 1,
          },
          update: {
            triviaCorrectCount: {
              increment: 1,
            }
          }
        });

        // update username
        const guildMember = interaction.guild?.members.cache.get(interaction.user.id);
        if (guildMember) {
          await nameBadgeUpdate(guildMember);
        }

        // Kalo jawaban benar
        thread.send(`✅ Jawaban <@!${interaction.user.id}> benar! 🥳`);
        await interaction.editReply({
          content: `✅ Jawaban kamu benar! 
          
Sssst 🤫, jangan kasih tau yang lain ya 🤭`,
        })
      } else if (isAnswered === 0) {
        // Kalo jawaban salah 1x
        thread.send(`❌ Jawaban <@!${interaction.user.id}> salah 😝`);
        await interaction.editReply({
          content: '❌ Jawabannya salah ya 😝. Kamu masih punya kesempatan 1 kali lagi!',
        })
      } else {
        // Kalo jawaban salah 2x
        thread.send(`❌ Jawaban <@!${interaction.user.id}> masih salah aja 🤣`);
        await interaction.editReply({
          content: '❌ Sayang sekali, kamu gagal di kesempatan terakhir 🙃. Yaudah jawabannya aku kirim lewat DM ya, biar kamu gak penasaran. 😁',
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