import { ActivityType, Client } from "discord.js";
import { ClientReadyListener } from "../base/client-ready-listener";

export class SetStatus extends ClientReadyListener {
  public async action(client: Client) {
    client.user?.setActivity('SkyKids Universe', { type: ActivityType.Custom, state: 'Berpetualang di Skykids' });
  }
}