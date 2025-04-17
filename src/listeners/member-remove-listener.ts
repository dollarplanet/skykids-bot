import { Events } from "discord.js";
import { ListenerBase } from "./listener-base";
import { MemberRemoveFeatureBase } from "../features/feature-base";

export class MemberRemoveListener extends ListenerBase {
  public async registerFeatures(features: MemberRemoveFeatureBase[]) {
    this.client.on(Events.GuildMemberRemove, async (...args) => {
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