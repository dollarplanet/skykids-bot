import { discord } from "../singleton/client-singleton";
import { prisma } from "../singleton/prisma-singleton";
import he from "he";
import { isFeatureDisabled } from "../utils/is-feature-disabled";

export async function triviaEnglish() {
  try {
    // Apakah fitur aktif
    if (await isFeatureDisabled("Trivia")) return;

    // Dapatkan config
    const config = await prisma.config.findUnique({
      where: {
        id: 1,
      },
      select: {
        triviaEnglishChannel: true
      }
    })
    if (!config?.triviaEnglishChannel) return;

    // dapatkan trivia
    const res = await fetch("https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple");
    const triviaJson = (await res.json()).results[0];

    // simpan trivia ke db
    const trivia = await prisma.trivia.create({
      data: {
        question: he.decode(triviaJson.question),
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
    const channel = await discord().channels.fetch(config.triviaEnglishChannel);
    if (!channel) return;

    // Cek sendable
    if (!channel.isSendable()) return;

    // Kirim trivia
    channel.send({
      content: trivia.question + "\n" + trivia.id.toString(),
    });
  } catch (err) {
    console.log(err)
  }
}