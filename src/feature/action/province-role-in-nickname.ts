import { GuildMember, PartialGuildMember } from "discord.js";
import { provinceRoles } from "../../utils/nickname-role-list";
import { GuildMemberUpdateListener } from "../base/guild-member-update-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";

export class ProvinceRoleInNickname extends GuildMemberUpdateListener {
  public async action(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
    try {
      // Cek fitur dimatikan
      if (await isFeatureDisabled("ProvinceRoleInNickname")) return;

      // Return kalo role dikurangi
      if (oldMember.roles.cache.size > newMember.roles.cache.size) return;

      // Return kalo role tetap sama
      if (oldMember.roles.cache.size === newMember.roles.cache.size) return;

      // Cari role yang baru ditambahkan
      const newRole = newMember.roles.cache.find(role => !oldMember.roles.cache.has(role.id));
      if (!newRole) return;

      // Harus bagian dari role provinsi
      if (!provinceRoles.includes(newRole.id)) return;

      const newNickname = `${newRole.name} ${oldMember.user.globalName}`;

      // Edit nickname
      await newMember.setNickname(newNickname);
    } catch {
      //
    }
  }
}