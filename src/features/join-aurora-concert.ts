import { Client } from "discord.js";
import { ClientReadyFeatureBase } from "./feature-base";
import { joinVoiceChannel } from "@discordjs/voice";
import { auroraPlayer } from "../aurora/player-singleton";

export class JoinAuroraConcert extends ClientReadyFeatureBase {
  public async action(client: Client) {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const channelId = "1362720685654278254";
    const guildId = "1301594669461016627";

    while (true) {
      await delay(10000);
      const channel = client.channels.cache.get(channelId);
      if (!channel) continue;
      if (!channel.isVoiceBased()) break;

      const connection = joinVoiceChannel({
        guildId: guildId,
        channelId: channelId,
        adapterCreator: channel.guild.voiceAdapterCreator
      })
      connection.subscribe(auroraPlayer());

      break;
    }
  }

}