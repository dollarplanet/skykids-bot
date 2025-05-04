import { Interaction } from "discord.js";

export abstract class CommandBase {
  protected abstract name: string;
  protected abstract description: string;

  public abstract action(interaction: Interaction): Promise<void>;

  public execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandName !== this.name) return;

    return this.action(interaction);
  }

  public dataJson() {
    return {
      name: this.name,
      description: this.description,
    };
  }
}