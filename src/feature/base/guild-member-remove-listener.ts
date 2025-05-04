import { Events, GuildMember, PartialGuildMember } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class GuildMemberRemoveListener extends ListenerBase {
  public abstract action(member: GuildMember | PartialGuildMember): Promise<void>;

  protected override async registerListener() {
    (await discord()).on(Events.GuildMemberRemove, this.action);
  }
}