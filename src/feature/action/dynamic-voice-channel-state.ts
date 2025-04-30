import { VoiceState } from "discord.js";
import { MemberVoiceGlobalState } from "../../utils/member-voice-global-state";
import { MemberVoiceState } from "../../utils/member-voice-state";
import dayjs from "dayjs";
import { capitalize } from "../../utils/capitalize";
import { VoiceStateUpdateListener } from "../base/voice-state-update-listener";

export class DynamicVoiceChannelState extends VoiceStateUpdateListener {
  public async action(oldState: VoiceState, newState: VoiceState) {
    try {
      const channelId = "1361398803445579987"; // Dynamic voice channel name
      const stateChannelId = oldState.channelId ?? newState.channelId;
      const isJoin = !oldState.channelId && newState.channelId;

      // Harus channel dynamic
      if (stateChannelId !== channelId) return;

      // Dapatkan channel
      const channel = await newState.guild.channels.fetch(channelId, { force: true });
      if (!channel) return;

      // Dapatkan instance member ter update
      if (!newState.member) return;
      const member = await newState.member.fetch(true) ?? newState.member;

      // Update global state
      if (isJoin) {
        if (newState.member === null) return;
        MemberVoiceGlobalState.add(new MemberVoiceState(
          dayjs(),
          member.id,
          capitalize(member.nickname ?? member.user.displayName ?? member.user.globalName ?? member.user.username),
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
    } catch {
      //
    }
  }

}