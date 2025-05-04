import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { discord } from "../singleton/client-singleton";
import { prisma } from "../singleton/prisma-singleton";
import { shuffle } from "../utils/shuffle";
import { translator } from "../utils/translator";
import he from "he";
import { isFeatureDisabled } from "../utils/is-feature-disabled";

export async function triviaHandler() {
  try {
    // Apakah fitur aktif
    if (await isFeatureDisabled("Trivia")) return;

    // Dapatkan config
    const config = await prisma.config.findUnique({
      where: {
        id: 1,
      },
      select: {
        triviaChannel: true
      }
    })
    if (!config?.triviaChannel) return;

    // dapatkan trivia
    const res = await fetch("https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple");
    const triviaJson = (await res.json()).results[0];

    // simpan trivia ke db
    const trivia = await prisma.trivia.create({
      data: {
        question: he.decode(triviaJson.question),
        questionIndo: await translator(he.decode(triviaJson.question)),
        correctAnswer: he.decode(triviaJson.correct_answer),
        category: he.decode(triviaJson.category),
        optionOne: he.decode(triviaJson.incorrect_answers[0]),
        optionTwo: he.decode(triviaJson.incorrect_answers[1]),
        optionThree: he.decode(triviaJson.incorrect_answers[2]),
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
    })

    // Dapatkan trivia channel
    const channel = await discord().channels.fetch(config.triviaChannel);
    if (!channel) return;

    // Cek sendable
    if (!channel.isSendable()) return;

    // Answer option
    const answerOptions = shuffle([
      trivia.correctAnswer,
      trivia.optionOne,
      trivia.optionTwo,
      trivia.optionThree,
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
    await channel.send({
      content: `*Kategori ${trivia.category}*

**${trivia.question}**
*"${trivia.questionIndo}"*
  
Jawaban kamu :`,
      components: [row as any]
    });
  } catch {
    //
  }
}