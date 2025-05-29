import { OmitPartialGroupDMChannel, Message } from "discord.js";
import { provinceRoles } from "../../utils/nickname-role-list";
import { MessageCreateListener } from "../base/message-create-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";
import { prisma } from "../../singleton/prisma-singleton";
import { badgeClearSafety, nameBadgeCheck } from "../../utils/name-badge-update";

export class ChangeNicknameChannel extends MessageCreateListener {
  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
      // Cek fitur dimatikan
      if (await isFeatureDisabled("ChangeNicknameChannel")) return;

      // Dapatkan config
      const config = await prisma.config.findUnique({
        where: {
          id: 1,
        },
        select: {
          changeNicknameChannel: true
        }
      })
      if (!config) return;

      // Harus dari channel change nickname
      if (data.channelId !== config.changeNicknameChannel) return;

      // Harus bukan bot
      if (data.author.bot) return;

      // Dapatkan pesan
      const content = data.content;

      // Validasi content
      const regex = /^(.{2,32})$/;
      if (!regex.test(content)) {
        await data.reply("Nickname harus antara 2-32 karakter!");
        return;
      }

      // Dapatkan role provinsi
      let provinceRole: string | undefined;
      if (!data.member) return;
      data.member.roles.cache.forEach(role => {
        if (provinceRoles.includes(role.id)) {
          provinceRole = role.name;
        }
      });

      // Harus punya role provinsi
      if (!provinceRole) {
        await data.reply("Kamu harus memiliki role Provinsi!");
        return;
      }

      // Ganti nickname
      try {
        const badges = await nameBadgeCheck(data.member, true);
        const nickname = badgeClearSafety(`${provinceRole} ${content}`, badges);
        await data.member.setNickname(`${nickname} ${badges}`);
        await data.reply("Yey, nickname kamu sudah diganti 😍");
        return;
      } catch {
        await data.reply("Maaf, sepertinya aku tidak bisa mengganti nickname kamu 😢");
        return;
      }
    } catch {
      //
    }
  }
}