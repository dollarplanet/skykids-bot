import { ActivityType, Client } from "discord.js";
import { ClientReadyListener } from "../base/client-ready-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";

export class SetStatus extends ClientReadyListener {
  public async action(client: Client) {
    try {
      // Cek fitur dimatikan
      if (await isFeatureDisabled("SetStatus")) return;

      client.user?.setActivity('SkyKids Universe', { type: ActivityType.Custom, state: 'Berpetualang di Skykids' });
    } catch {
      //
    }
  }
}