import { GuildMember } from "discord.js";
import { GuildMemberAddListener } from "../base/guild-member-add-listener";

export class AddRoleOnMemberJoin extends GuildMemberAddListener {
  public async action(member: GuildMember) {
    try {
      // Add role adventurer
      await member.roles.add("1360285795159642242");
    } catch {
      //
    }
  }
}