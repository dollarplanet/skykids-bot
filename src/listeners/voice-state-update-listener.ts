import { Events } from "discord.js";
import { ListenerBase } from "./listener-base";
import { VoiceStateUpdateFeatureBase } from "../features/feature-base";

export class VoiceStateUpdateListener extends ListenerBase {
  public async registerFeatures(features: VoiceStateUpdateFeatureBase[]) {
    this.client.on(Events.VoiceStateUpdate, async (...args) => {
      try {
        for (const feature of features) {
          await feature.action(...args);
        }
      } catch {
        // do nothing
      }
    });
  }
}