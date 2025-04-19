import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior } from "@discordjs/voice";
import { nextSong } from "./queue";

let auroraPlayerHolder: AudioPlayer | null = null

let status: AudioPlayerStatus = AudioPlayerStatus.Idle;

export function auroraPlayerStatus(): AudioPlayerStatus {
  return status;
}

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
      status = AudioPlayerStatus.Idle;

      // Mainkan lagu berikutnya
      auroraPlayerHolder?.play(nextSong());
    });

    // On Pause
    auroraPlayerHolder.on(AudioPlayerStatus.Paused, () => {
      status = AudioPlayerStatus.Paused;
    });

    // On Resume
    auroraPlayerHolder.on(AudioPlayerStatus.Playing, () => {
      status = AudioPlayerStatus.Playing;
    });

    // On Buffering
    auroraPlayerHolder.on(AudioPlayerStatus.Buffering, () => {
      status = AudioPlayerStatus.Buffering;
    });

    auroraPlayerHolder.on(AudioPlayerStatus.AutoPaused, () => {
      status = AudioPlayerStatus.AutoPaused;
    })
  }

  return auroraPlayerHolder
}