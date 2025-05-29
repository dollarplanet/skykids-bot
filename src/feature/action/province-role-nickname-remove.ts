import { GuildMember, PartialGuildMember } from "discord.js";
import { provinceRoles } from "../../utils/nickname-role-list";
import { GuildMemberUpdateListener } from "../base/guild-member-update-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";
import { badgeClearSafety, nameBadgeCheck } from "../../utils/name-badge-update";

export class ProvinceRoleNicknameRemove extends GuildMemberUpdateListener {
  public async action(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
    try {
      // Cek fitur dimatikan
      if (await isFeatureDisabled("ProvinceRoleNicknameRemove")) return;

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
      const badges = await nameBadgeCheck(newMember, true);
      const nickname = badgeClearSafety(newMember.user.globalName ?? newMember.user.username, badges);
      await newMember.setNickname(`${nickname} ${badges}`);
    } catch {
      //
    }
  }

}