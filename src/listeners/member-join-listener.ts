import { Events } from "discord.js";
import { ListenerBase } from "./listener-base";

export class MemberJoinListener extends ListenerBase {
  public async registerFeatures() {
    try {
      this.client.on(Events.GuildMemberAdd, async (member) => {
        await member.send(`Halo ${member.displayName} 👋, selamat datang di server Skykids, mari berpetualang bersama 🥳`);
      });
    } catch {}
  }
}