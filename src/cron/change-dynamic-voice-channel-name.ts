import { discord } from "../singleton/client-singleton";
import { capitalize } from "../utils/capitalize";
import { MemberVoiceGlobalState } from "../utils/member-voice-global-state";

export async function changeDynamicVoiceChannelName() {
  const channelId = "1361398803445579987";
  const guildId = "1301594669461016627";

  // Dapatkan guild
  const guild = (await discord()).guilds.cache.get(guildId);
  if (!guild) return;

  // Dapatkan channel
  const channel = await guild.channels.fetch(channelId, { force: true });
  if (!channel) return;

  // Ganti ke default
  if (MemberVoiceGlobalState.state.length === 0) {
    await channel.setName("🍺 • Skykid's Cafe");
    return;
  }

  // Ganti nama channel
  await channel.setName(`🍺 • ${capitalize(MemberVoiceGlobalState.state[0].name)}'s Cafe`);
}