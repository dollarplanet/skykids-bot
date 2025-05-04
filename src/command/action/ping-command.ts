import { Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "./command-base";

export class PingCommand extends CommandBase {
  protected name: string = "ping";
  protected description: string = "Ping bot";
  
  public async action(interaction: Interaction) {
    // Cek apakah pisa di reply
    if (!interaction.isRepliable()) return;

    // Reply ping
    await interaction.reply({
      content: 'Pong!',
      flags: MessageFlags.Ephemeral
    });
  }

}