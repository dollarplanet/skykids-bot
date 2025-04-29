import { Events, GuildMember } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class GuildMemberAddListener extends ListenerBase {
  public abstract action(member: GuildMember): Promise<void>;

  protected registerListener() {
    discord().on(Events.GuildMemberAdd, (...args) => {
      try {
        this.action(...args);
      } catch {
        // do nothing
      }
    });
  }
}