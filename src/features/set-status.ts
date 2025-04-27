import { ActivityType, Client } from "discord.js";
import { ClientReadyFeatureBase } from "./feature-base";

export class SetStatus extends ClientReadyFeatureBase {
  public async action(client: Client) {
    client.user?.setActivity('SkyKids Universe', { type: ActivityType.Custom, state: 'Berpetualang di Skykids' });
  }
}