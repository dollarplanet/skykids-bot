import { Events, Interaction } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class InteractionCreateListener extends ListenerBase {
  public abstract action(interaction: Interaction): Promise<void>;

  protected override async registerListener() {
    discord().on(Events.InteractionCreate, this.action);
  }
}