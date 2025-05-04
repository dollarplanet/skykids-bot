import { GuildMember } from "discord.js";
import { GuildMemberAddListener } from "../base/guild-member-add-listener";
import { prisma } from "../../singleton/prisma-singleton";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";

export class AddRoleOnMemberJoin extends GuildMemberAddListener {
  public async action(member: GuildMember) {
    try {
      // Cek fitur diaktifkan
      if (await isFeatureDisabled("AddRoleOnMemberJoin")) return;

      // Get roles
      const roles = await prisma.initialRole.findMany();

      // Add roles
      await member.roles.add(roles.map(role => role.roleId));
    } catch {
      //
    }
  }
}