import { GuildMember } from "discord.js";
import { MemberAddFeatureBase } from "./feature-base";

export class AddRoleOnMemberJoin extends MemberAddFeatureBase {
  public async action(member: GuildMember) {
    // Add role adventurer
    await member.roles.add("1360285795159642242");
  }

}