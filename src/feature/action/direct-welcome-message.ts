import { GuildMember } from "discord.js";
import { GuildMemberAddListener } from "../base/guild-member-add-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";

export class DirectWelcomeMessage extends GuildMemberAddListener {
  public async action(member: GuildMember) {
    try {
      // Cek fitur diaktifkan
      if (await isFeatureDisabled("DirectWelcomeMessage")) return;

      await member.send(`Halo ${member.user.globalName} 👋, selamat datang di komunitas Skykids, mari berpetualang bersama 🥳`);
    } catch {
      //
    }
  }
}