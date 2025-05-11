import { Interaction } from "discord.js";
import { InteractionCreateListener } from "../feature/base/interaction-create-listener";
import { CommandBase } from "./action/command-base";
import { DefaultRoleCommand } from "./action/default-role-command";
import { PingCommand } from "./action/ping-command";
import { ChangeNicknameChannelCommand } from "./action/change-nickname-channel-command";
import { ActiveFeatureCommand } from "./action/active-feature-command";
import { TriviaChannelCommand } from "./action/trivia-channel-command";
import { GetTriviaCommand } from "./action/get-trivia-command";
import { TriviaChannelEnglishCommand } from "./action/trivia-channel-english-command";
import { TriviaChannelIndonesiaCommand } from "./action/trivia-channel-indonesia-command";
import { FishingChannelCommand } from "./action/fishing-channel-command";
import { FishNowCommand } from "./action/fishing/fish-now-command";
import { FishOpportunitiesCommand } from "./action/fishing/fish-opportunities-command";
import { BucketCommand } from "./action/fishing/bucket-command";
import { WalletCommand } from "./action/fishing/wallet-command";
import { BuyRodCommand } from "./action/fishing/buy-rod-command";
import { WorkCommand } from "./action/fishing/work-command";
import { RankCommand } from "./action/fishing/rank-command";
import { ShowoffCommand } from "./action/fishing/showoff-command";

export class CommandInteractionHandler extends InteractionCreateListener {
  static readonly commands: CommandBase[] = [
    new DefaultRoleCommand(),
    new PingCommand(),
    new ChangeNicknameChannelCommand(),
    new ActiveFeatureCommand(),
    new TriviaChannelCommand(),
    new GetTriviaCommand(),
    new TriviaChannelEnglishCommand(),
    new TriviaChannelIndonesiaCommand(),
    new FishingChannelCommand(),
    new FishNowCommand(),
    new FishOpportunitiesCommand(),
    new BucketCommand(),
    new WalletCommand(),
    new BuyRodCommand(),
    new WorkCommand(),
    new RankCommand(),
    new ShowoffCommand(),
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