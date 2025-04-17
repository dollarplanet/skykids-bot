import { GuildMember } from "discord.js";
import { MemberAddFeatureBase } from "./feature-base";

export class DirectWelcomeMessage implements MemberAddFeatureBase {
  public async action(member: GuildMember) {
    await member.send(`Halo ${member.user.globalName} 👋, selamat datang di komunitas Skykids, mari berpetualang bersama 🥳`);
  }
}