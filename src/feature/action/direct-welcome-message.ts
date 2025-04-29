import { GuildMember } from "discord.js";
import { GuildMemberAddListener } from "../base/guild-member-add-listener";

export class DirectWelcomeMessage extends GuildMemberAddListener {
  public async action(member: GuildMember) {
    await member.send(`Halo ${member.user.globalName} 👋, selamat datang di komunitas Skykids, mari berpetualang bersama 🥳`);
  }
}