import { GuildMember } from "discord.js";
import { GuildMemberAddListener } from "../base/guild-member-add-listener";
import { prisma } from "../../singleton/prisma-singleton";

export class AddRoleOnMemberJoin extends GuildMemberAddListener {
  public async action(member: GuildMember) {
    try {
      // Get roles
      const roles = await prisma.initialRole.findMany();

      // Add roles
      await member.roles.add(roles.map(role => role.roleId));
    } catch {
      //
    }
  }
}