import { Interaction } from "discord.js";
import { InteractionCreateListener } from "../feature/base/interaction-create-listener";
import { CommandBase } from "./action/command-base";
import { DefaultRoleCommand } from "./action/default-role-command";
import { PingCommand } from "./action/ping-command";
import { ChangeNicknameChannelCommand } from "./action/change-nickname-channel-command";
import { ActiveFeatureCommand } from "./action/active-feature-command";
import { TriviaChannelCommand } from "./action/trivia-channel-command";
import { GetTriviaCommand } from "./action/get-trivia-command";

export class CommandInteractionHandler extends InteractionCreateListener {
  static readonly commands: CommandBase[] = [
    new DefaultRoleCommand(),
    new PingCommand(),
    new ChangeNicknameChannelCommand(),
    new ActiveFeatureCommand(),
    new TriviaChannelCommand(),
    new GetTriviaCommand(),
  ]

  public async action(interaction: Interaction) {
    try {
      CommandInteractionHandler.commands.forEach(async command => {
        await command.execute(interaction);
      });
    } catch {
      //
    }
  }
}