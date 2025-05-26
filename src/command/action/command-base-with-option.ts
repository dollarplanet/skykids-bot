import { SlashCommandOptionsOnlyBuilder } from "discord.js";
import { CommandBase } from "./command-base";

export abstract class CommandBaseWitOption extends CommandBase {
  protected description: string = "";
  protected abstract builder: SlashCommandOptionsOnlyBuilder;

  public dataJson() {
    return this.builder.toJSON();
  }
}