import { Events, GuildMember } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class GuildMemberAddListener extends ListenerBase {
  public abstract action(member: GuildMember): Promise<void>;

  protected override registerListener() {
    discord().on(Events.GuildMemberAdd, this.action);
  }
}