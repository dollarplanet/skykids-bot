import { Events } from "discord.js";
import { ListenerBase } from "./listener-base";
import { ClientReadyFeatureBase } from "../features/feature-base";

export class ClientReadyListener extends ListenerBase {
  public async registerFeatures(features: ClientReadyFeatureBase[]) {
    this.client.on(Events.ClientReady, async (...args) => {
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