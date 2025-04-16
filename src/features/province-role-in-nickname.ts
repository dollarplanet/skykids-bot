import { GuildMember, PartialGuildMember } from "discord.js";
import { MemberUpdateFeatureBase } from "./feature-base";
import { provinceRoles } from "../utils/nickname-role-list";

export class ProvinceRoleInNickname extends MemberUpdateFeatureBase {
  public async action(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
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

    // Notify member
    await newMember.send(`Wah, ternyata kamu dari provinsi ${newRole.name} ya, kalo gitu nickname kamu sekarang menjadi ${newNickname}! 🥳`);
  }
}