import { Client, Events } from "discord.js";
import { ListenerBase } from "./listener-base";
import { FeatureBase, ThreadFeatureBase } from "../features/feature-base";

export class ThreadListener extends ListenerBase {
  public constructor(client: Client) {
    super(client);
  }

  public async registerFeatures(features: ThreadFeatureBase[]): Promise<void> {
    this.client.on(Events.ThreadCreate, async (channel) => {
      for (const feature of features) {
        await feature.action(channel)
      }
    })
  }
}