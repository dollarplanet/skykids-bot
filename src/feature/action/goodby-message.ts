import { GuildMember, PartialGuildMember } from "discord.js";
import { GuildMemberRemoveListener } from "../base/guild-member-remove-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";

export class GoodbyMessage extends GuildMemberRemoveListener {
  
  public async action(member: GuildMember | PartialGuildMember) {
    try {
      const goodbyChannelId = "1362379775079088329";
      // Cek fitur dimatikan
      if (await isFeatureDisabled("GoodbyMessage")) return;

      // Dapatkan channel goodby
      const goodbyChannel = member.guild?.channels.cache.get(goodbyChannelId);
      if (!goodbyChannel) return;

      // Kirim pesan ke goodby channel
      if (goodbyChannel.isSendable()) {
        await goodbyChannel.send(`Sampai jumpa lagi <@!${member.user.id}>! 👋, senang sekali bisa mengenalmu.`);
      }
    } catch {
      //
    }
  }
}