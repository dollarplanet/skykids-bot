import { MemberVoiceState } from "./member-voice-state";

export const memberVoiceGlobalState: MemberVoiceState[] = [];

export class MemberVoiceGlobalState {
  private static _state: MemberVoiceState[] = [];

  public static add(state: MemberVoiceState) {
    MemberVoiceGlobalState._state.push(state);
  }

  public static remove(userId: string) {
    const index = this._state.map(state => state.userid).indexOf(userId, 0);
    if (index > -1) this._state.splice(index, 1);
  }

  public static get state() {
    return this._state.sort((a, b) => a.joinedAt.diff(b.joinedAt, "seconds"));
  }
}