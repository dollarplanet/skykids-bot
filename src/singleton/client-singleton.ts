import { Client, GatewayIntentBits } from "discord.js";
import { prisma } from "./prisma-singleton";

let _discord: Client | null = null

export async function discord() {
  if (!_discord) {
    // Dapatkan intent aktif dari database
    const intents = await prisma.activeIntent.findMany({ select: { name: true } });

    _discord = new Client({
      intents: intents.map(intent => GatewayIntentBits[intent.name]),
    });
  }

  return _discord
}