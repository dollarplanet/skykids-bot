import { Events, GuildMember, PartialGuildMember } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class GuildMemberUpdateListener extends ListenerBase {
  public abstract action(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember): Promise<void>;

  protected override registerListener() {
    discord().on(Events.GuildMemberUpdate, this.action);
  }}