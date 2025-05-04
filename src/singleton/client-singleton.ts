import { Client } from "discord.js";

let _discord: Client | null = null

export function discord() {
  if (!_discord) {
    _discord = new Client({
      intents: [
        "Guilds",
        "GuildMembers",
        "GuildPresences",
        "GuildMessages",
        "MessageContent",
        "GuildVoiceStates",
      ],
    });
  }

  return _discord
}