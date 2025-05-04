import { GuildMember, PartialGuildMember } from "discord.js";
import { GuildMemberRemoveListener } from "../base/guild-member-remove-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";

export class GoodbyMessage extends GuildMemberRemoveListener {
  private goodbyChannelId = "1362379775079088329";

  public async action(member: GuildMember | PartialGuildMember) {
    try {
      // Cek fitur dimatikan
      if (await isFeatureDisabled("GoodbyMessage")) return;

      // Kirim DM ke user
      await member.send(`${member.user.globalName}, terima kasih telah bersama kami di komunitas ${member.guild.name}! 😭. Kami semua akan merindukanmu 😢. Sampai jumpa di lain waktu 👋`);

      // Dapatkan channel goodby
      const goodbyChannel = member.guild?.channels.cache.get(this.goodbyChannelId);
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