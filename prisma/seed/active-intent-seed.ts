import { prisma } from "../../src/singleton/prisma-singleton";
import { intentEnum } from "@prisma/xxx-client"

export async function activeIntentSeed() {
  const activeIntents: intentEnum[] = [
    "Guilds",
    "GuildMembers",
    "GuildPresences",
    "GuildMessages",
    "MessageContent",
    "GuildVoiceStates",
  ]

  activeIntents.forEach(async intent => {
    await prisma.activeIntent.upsert({
      where: {
        name: intent
      },
      update: {},
      create: {
        name: intent
      }
    });
  })

  for (const intent of activeIntents) {
    await prisma.activeIntent.upsert({
      where: {
        name: intent
      },
      update: {},
      create: {
        name: intent
      }
    });
  }
}