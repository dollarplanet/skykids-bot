import { VoiceState } from "discord.js";
import { VoiceStateUpdateFeatureBase } from "./feature-base";
import { auroraPlayer } from "../aurora/player-singleton";
import { nextSong } from "../aurora/queue";

export class PlayAuroraPlaylist extends VoiceStateUpdateFeatureBase {
  public async action(_: VoiceState, newState: VoiceState) {
    const channelId = "1362720685654278254";
    const skykidsOfficialId = "1361696187844923412";

    // Harus channel aurora
    if (newState.channelId !== channelId) return;

    // Harus Skykids Official
    if (newState.member?.id !== skykidsOfficialId) return;

    // Mainkan musik
    auroraPlayer().play(nextSong());
  }
}