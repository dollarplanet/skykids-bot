import { Events } from "discord.js";
import { ListenerBase } from "./listener-base";
import { MemberAddFeatureBase } from "../features/feature-base";

export class MemberAddListener extends ListenerBase {
  public async registerFeatures(features: MemberAddFeatureBase[]) {
    this.client.on(Events.GuildMemberAdd, async (...args) => {
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