import { VoiceState } from "discord.js";
import { VoiceStateUpdateFeatureBase } from "./feature-base";
import { MemberVoiceGlobalState } from "../utils/member-voice-global-state";
import { MemberVoiceState } from "../utils/member-voice-state";
import dayjs from "dayjs";
import { capitalize } from "../utils/capitalize";

export class DynamicVoiceChannelState extends VoiceStateUpdateFeatureBase {
  public async action(oldState: VoiceState, newState: VoiceState) {
    const channelId = "1361398803445579987"; // Dynamic voice channel name
    const stateChannelId = oldState.channelId ?? newState.channelId;
    const isJoin = !oldState.channelId && newState.channelId;

    // Harus channel dynamic
    if (stateChannelId !== channelId) return;

    // Dapatkan channel
    const channel = await newState.guild.channels.fetch(channelId, { force: true });
    if (!channel) return;

    // Update global state
    if (isJoin) {
      if (newState.member === null) return;
      MemberVoiceGlobalState.add(new MemberVoiceState(
        dayjs(),
        newState.member.user.id,
        capitalize((newState.member.user.displayName ?? newState.member.user.globalName) ?? newState.member.user.username),
      ));
    } else {
      if (oldState.member === null) return;
      
      // Kalo disconnect pas streaming
      if (oldState.streaming && newState.streaming) {
        MemberVoiceGlobalState.remove(oldState.member.user.id);
        return;
      }

      if (newState.streaming || oldState.streaming) return;
      MemberVoiceGlobalState.remove(oldState.member.user.id);
    }
  }

}