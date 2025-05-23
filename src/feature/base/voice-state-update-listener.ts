import { Events, VoiceState } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class VoiceStateUpdateListener extends ListenerBase {
  public abstract action(oldState: VoiceState, newState: VoiceState): Promise<void>;

  protected override async registerListener() {
    discord().on(Events.VoiceStateUpdate, this.action);
  }
}