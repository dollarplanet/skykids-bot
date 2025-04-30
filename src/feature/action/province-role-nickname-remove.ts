import { GuildMember, PartialGuildMember } from "discord.js";
import { provinceRoles } from "../../utils/nickname-role-list";
import { GuildMemberUpdateListener } from "../base/guild-member-update-listener";

export class ProvinceRoleNicknameRemove extends GuildMemberUpdateListener {
  public async action(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
    try {
      // Return kalo role ditambah
      if (oldMember.roles.cache.size < newMember.roles.cache.size) return;

      // Return kalo role tetap sama
      if (oldMember.roles.cache.size === newMember.roles.cache.size) return;

      // Cari role yang baru dihapus
      const oldRole = oldMember.roles.cache.find(role => !newMember.roles.cache.has(role.id));
      if (!oldRole) return;

      // Harus bagian dari role provinsi
      if (!provinceRoles.includes(oldRole.id)) return;

      // Reset nickname
      await newMember.setNickname(newMember.user.globalName);
    } catch {
      //
    }
  }

}