import { CronJob } from "cron";
import { changeDynamicVoiceChannelName } from "./change-dynamic-voice-channel-name";
import { triviaHandler } from "./trivia-handler";

export function startCron() {
  CronJob.from({
    cronTime: "*/5 * * * *",
    timeZone: "Asia/Jakarta",
    onTick: changeDynamicVoiceChannelName,
    start: true,
  });

  CronJob.from({
    cronTime: "0 6 * * *",
    timeZone: "Asia/Jakarta",
    onTick: triviaHandler,
    start: true,
  });

  CronJob.from({
    cronTime: "0 18 * * *",
    timeZone: "Asia/Jakarta",
    onTick: triviaHandler,
    start: true,
  });
}
