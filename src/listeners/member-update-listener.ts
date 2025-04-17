import { Events } from "discord.js";
import { ListenerBase } from "./listener-base";
import { MemberUpdateFeatureBase } from "../features/feature-base";

export class MemberUpdateListener extends ListenerBase {
  public async registerFeatures(features: MemberUpdateFeatureBase[]) {
    this.client.on(Events.GuildMemberUpdate, async (...args) => {
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