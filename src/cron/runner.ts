import { CronJob } from "cron";
import { changeDynamicVoiceChannelName } from "./change-dynamic-voice-channel-name";

export function startCron() {
  CronJob.from({
    cronTime: "*/5 * * * *",
    timeZone: "Asia/Jakarta",
    onTick: changeDynamicVoiceChannelName,
    start: true,
  });
}
