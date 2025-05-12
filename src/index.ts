import dotenv from "dotenv";
import { discord } from "./singleton/client-singleton";
import { startCron } from "./cron/runner";
import { AddRoleOnMemberJoin } from "./feature/action/add-role-on-member-join";
import { ChangeNicknameChannel } from "./feature/action/change-nickname-channel";
import { DailyQuestionForward } from "./feature/action/daily-question-forward";
import { DirectWelcomeMessage } from "./feature/action/direct-welcome-message";
import { DynamicVoiceChannelState } from "./feature/action/dynamic-voice-channel-state";
import { GoodbyMessage } from "./feature/action/goodby-message";
import { MediaOnlyForum } from "./feature/action/media-only-forum";
import { ProvinceRoleInNickname } from "./feature/action/province-role-in-nickname";
import { ProvinceRoleNicknameRemove } from "./feature/action/province-role-nickname-remove";
import { SetStatus } from "./feature/action/set-status";
import { WelcomeBannerForward } from "./feature/action/welcome-banner-forward";
import { CommandInteractionHandler } from "./command/command-interaction-handler";
import { TriviaAnswerCheck } from "./feature/action/trivia-answer-check";
import { TriviaForward } from "./feature/action/trivia-forward";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { OpportunitiesNextListener } from "./command/action/fishing/opportunities-next-listener";
import { BucketNextListener } from "./command/action/fishing/bucket-next-listener";
import { SellListener } from "./command/action/fishing/sell-listener";
import { SellLimitListener } from "./command/action/fishing/sell-limit-listener";
import { BuyRodNextListener } from "./command/action/fishing/buy-rod-next-listener";
import { BuyRodBuyListener } from "./command/action/fishing/buy-rod-buy-listener";
import { CurrentRodListener } from "./command/action/fishing/current-rod-listener";

// Load environment variables
dotenv.config();

// extends dayjs
dayjs.extend(utc)
dayjs.extend(timezone)

function featureInit() {
  new AddRoleOnMemberJoin();
  new ChangeNicknameChannel();
  new DailyQuestionForward();
  new DirectWelcomeMessage();
  new DynamicVoiceChannelState();
  new GoodbyMessage();
  new MediaOnlyForum();
  new ProvinceRoleInNickname();
  new ProvinceRoleNicknameRemove();
  new SetStatus();
  new WelcomeBannerForward();
  new CommandInteractionHandler();
  new TriviaAnswerCheck();
  new TriviaForward();
  new OpportunitiesNextListener();
  new BucketNextListener();
  new SellListener();
  new SellLimitListener();
  new BuyRodNextListener();
  new BuyRodBuyListener();
  new CurrentRodListener();
}

// Register features
featureInit();

// Login
discord().login(process.env.DISCORD_TOKEN).then(async () => {
  // Start cron job
  startCron();
});