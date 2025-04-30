import { Collection, GuildMember, VoiceState } from "discord.js";
import { nextSong } from "../../aurora/queue";
import { auroraPlayer, auroraPlayerStatus } from "../../aurora/player-singleton";
import { AudioPlayerStatus } from "@discordjs/voice";
import { VoiceStateUpdateListener } from "../base/voice-state-update-listener";

export class PlayAuroraPlaylist extends VoiceStateUpdateListener {
  public async action(oldState: VoiceState, newState: VoiceState) {
    try {
      const channelId = "1362720685654278254";
      const skykidsOfficialId = "1361696187844923412";
      const stateChannelId = oldState.channelId ?? newState.channelId;

      // Harus channel aurora
      if (stateChannelId !== channelId) return;

      // Dapatkan channel
      const channel = await newState.guild.channels.fetch(channelId, { force: true });
      if (!channel) return;

      // Dapatkan member di channel
      const members = channel.members as Collection<string, GuildMember>;

      // Skykids Official harus ada di channel
      if (!members.has(skykidsOfficialId)) return;

      // Member harus lebih dari 1
      if (members.size < 2) return;

      // Return kalo musik sedang berjalan
      if (auroraPlayerStatus() === AudioPlayerStatus.Playing) return;

      // Mainkan musik
      auroraPlayer().play(nextSong());
    } catch {
      //
    }
  }
}