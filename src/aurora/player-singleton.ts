import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior } from "@discordjs/voice";
import { nextSong } from "./queue";

let auroraPlayerHolder: AudioPlayer | null = null

export function auroraPlayer(): AudioPlayer {
  if (!auroraPlayerHolder) {
    // Buat player baru
    auroraPlayerHolder = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    // Register listener
    auroraPlayerHolder.on(AudioPlayerStatus.Idle, () => {
      // Mainkan lagu berikutnya
      auroraPlayerHolder?.play(nextSong());
    });

    auroraPlayerHolder.on(AudioPlayerStatus.AutoPaused, () => {
      console.log("AutoPaused");
    });
  }

  return auroraPlayerHolder
}