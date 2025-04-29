import dotenv from "dotenv";
import { MediaOnlyForum } from "./feature/action/media-only-forum";
import { DirectWelcomeMessage } from "./feature/action/direct-welcome-message";
import { ProvinceRoleInNickname } from "./feature/action/province-role-in-nickname";
import { ProvinceRoleNicknameRemove } from "./feature/action/province-role-nickname-remove";
import { DailyQuestionForward } from "./feature/action/daily-question-forward";
import { AddRoleOnMemberJoin } from "./feature/action/add-role-on-member-join";
import { WelcomeBannerForward } from "./feature/action/welcome-banner-forward";
import { GoodbyMessageAndDm } from "./feature/action/goodby-message-and-dm";
import { DynamicVoiceChannelState } from "./feature/action/dynamic-voice-channel-state";
import { discord } from "./singleton/client-singleton";
import { startCron } from "./cron/runner";
import { ChangeNicknameChannel } from "./feature/action/change-nickname-channel";
import { SetStatus } from "./feature/action/set-status";

// Load environment variables
dotenv.config();

// Register features
new SetStatus();
new MediaOnlyForum();
new DirectWelcomeMessage();
new AddRoleOnMemberJoin();
new ProvinceRoleInNickname();
new ProvinceRoleNicknameRemove();
new DailyQuestionForward();
new WelcomeBannerForward();
new ChangeNicknameChannel();
new GoodbyMessageAndDm();
new DynamicVoiceChannelState();

// Login
discord().login(process.env.DISCORD_TOKEN).then(() => {
  // Start cron job
  startCron();
});