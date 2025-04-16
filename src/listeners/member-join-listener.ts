import { Events } from "discord.js";
import { ListenerBase } from "./listener-base";

export class MemberJoinListener extends ListenerBase {
  public async registerFeatures() {
    try {
      this.client.on(Events.GuildMemberAdd, async (member) => {
        await member.send("Selamat datang adventurer 👋, mari berpetualang bersama 🥳");
      });
    } catch {}
  }
}