import { Events } from "discord.js";
import { ListenerBase } from "./listener-base";
import { MessageCreateFeatureBase } from "../features/feature-base";

export class MessageCreateListener extends ListenerBase {
  public async registerFeatures(features: MessageCreateFeatureBase[]): Promise<void> {
    this.client.on(Events.MessageCreate, async (...args) => {
      try {
        for (const feature of features) {
          await feature.action(...args)
        }
      } catch {
        // do nothing
      }
    })
  }
}