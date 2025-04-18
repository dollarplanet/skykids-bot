import { Collection, GuildMember, VoiceState } from "discord.js";
import { VoiceStateUpdateFeatureBase } from "./feature-base";
import { auroraPlayer } from "../aurora/player-singleton";

export class PauseAuroraPlaylist extends VoiceStateUpdateFeatureBase {
  public async action(oldState: VoiceState, newState: VoiceState) {
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

    // Member lebih dari 1 dan ada skykids official, return
    if (members.size >= 2 && members.has(skykidsOfficialId)) return;

    // Pause musik
    auroraPlayer().pause();
  }
}