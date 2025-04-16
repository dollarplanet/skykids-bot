import { Events, GuildMember } from "discord.js";
import { FeatureBase } from "../features/feature-base";
import { ListenerBase } from "./listener-base";

export class MemberJoinListener extends ListenerBase {
  public async registerFeatures() {
    this.client.on(Events.GuildMemberAdd, async (member) => {
     await member.send("Selamat datang adventurer 👋, mari berpetualang bersama 🥳");
    });
  }
}