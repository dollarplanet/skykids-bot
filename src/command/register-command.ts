import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { CommandInteractionHandler } from "./command-interaction-handler";

// Load environment variables
dotenv.config();

export async function registerCommand() {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
    {
      body: CommandInteractionHandler.commands.map(command => command.dataJson()),
    }
  )
}

registerCommand();