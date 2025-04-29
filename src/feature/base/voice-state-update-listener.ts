import { Events, VoiceState } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class VoiceStateUpdateListener extends ListenerBase {
  public abstract action(oldState: VoiceState, newState: VoiceState): Promise<void>;

  protected registerListener() {
    discord().on(Events.VoiceStateUpdate, (...args) => {
      try {
        this.action(...args);
      } catch {
        // do nothing
      }
    });
  }
}