import { OmitPartialGroupDMChannel, Message } from "discord.js";
import { provinceRoles } from "../../utils/nickname-role-list";
import { MessageCreateListener } from "../base/message-create-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";

export class ChangeNicknameChannel extends MessageCreateListener {
  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
      // Cek fitur diaktifkan
      if (await isFeatureDisabled("ChangeNicknameChannel")) return;

      const channelId = "1365998319687434280";
      const adventurerRoleId = "1360285795159642242";

      // Harus dari channel change nickname
      if (data.channelId !== channelId) return;

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

      // Harus ada role adventurer
      if (!data.member) return;
      if (!data.member.roles.cache.has(adventurerRoleId)) {
        await data.reply("Kamu harus memiliki role Adventurer!");
        return;
      };

      // Dapatkan role provinsi
      let provinceRole: string | undefined;
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
        await data.member.setNickname(`${provinceRole} ${content}`);
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