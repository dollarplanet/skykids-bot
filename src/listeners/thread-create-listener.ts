import { Client, Events } from "discord.js";
import { ListenerBase } from "./listener-base";
import { ThreadFeatureBase } from "../features/feature-base";

export class ThreadCreateListener extends ListenerBase {
  public async registerFeatures(features: ThreadFeatureBase[]): Promise<void> {
    this.client.on(Events.ThreadCreate, async (...args) => {
      try {
        for (const feature of features) {
          await feature.action(...args)
        }
      } catch {}
    })
  }
}