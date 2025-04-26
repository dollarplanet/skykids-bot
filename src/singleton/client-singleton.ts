import { Client, GatewayIntentBits } from "discord.js";

let _discord: Client | null = null

export function discord() {
  if (!_discord) {
    _discord = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ]
    });
  }
  
  return _discord
}