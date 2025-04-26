import { Dayjs } from "dayjs";

export class MemberVoiceState {
  private _joinedAt: Dayjs;
  private _userid: string;
  private _name: string;

  constructor(public joinedAt: Dayjs, public userid: string, public name: string) {
    this._joinedAt = joinedAt;
    this._userid = userid;
    this._name = name;
  }
}