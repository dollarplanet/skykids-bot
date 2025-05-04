import dotenv from "dotenv";
import { discord } from "./singleton/client-singleton";
import { startCron } from "./cron/runner";
import { AddRoleOnMemberJoin } from "./feature/action/add-role-on-member-join";
import { ChangeNicknameChannel } from "./feature/action/change-nickname-channel";
import { DailyQuestionForward } from "./feature/action/daily-question-forward";
import { DirectWelcomeMessage } from "./feature/action/direct-welcome-message";
import { DynamicVoiceChannelState } from "./feature/action/dynamic-voice-channel-state";
import { GoodbyMessageAndDm } from "./feature/action/goodby-message-and-dm";
import { MediaOnlyForum } from "./feature/action/media-only-forum";
import { ProvinceRoleInNickname } from "./feature/action/province-role-in-nickname";
import { ProvinceRoleNicknameRemove } from "./feature/action/province-role-nickname-remove";
import { SetStatus } from "./feature/action/set-status";
import { WelcomeBannerForward } from "./feature/action/welcome-banner-forward";

// Load environment variables
dotenv.config();

function featureInit() {
  new AddRoleOnMemberJoin();
  new ChangeNicknameChannel();
  new DailyQuestionForward();
  new DirectWelcomeMessage();
  new DynamicVoiceChannelState();
  new GoodbyMessageAndDm();
  new MediaOnlyForum();
  new ProvinceRoleInNickname();
  new ProvinceRoleNicknameRemove();
  new SetStatus();
  new WelcomeBannerForward();
}

// Register features
featureInit();

// Login
discord().login(process.env.DISCORD_TOKEN).then(() => {
  // Start cron job
  startCron();
});