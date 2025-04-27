import dotenv from "dotenv";
import { ThreadCreateListener } from "./listeners/thread-create-listener";
import { MediaOnlyForum } from "./features/media-only-forum";
import { MemberAddListener } from "./listeners/member-add-listener";
import { DirectWelcomeMessage } from "./features/direct-welcome-message";
import { MemberUpdateListener } from "./listeners/member-update-listener";
import { ProvinceRoleInNickname } from "./features/province-role-in-nickname";
import { ProvinceRoleNicknameRemove } from "./features/province-role-nickname-remove";
import { MessageCreateListener } from "./listeners/message-create-listener";
import { DailyQuestionForward } from "./features/daily-question-forward";
import { AddRoleOnMemberJoin } from "./features/add-role-on-member-join";
import { WelcomeBannerForward } from "./features/welcome-banner-forward";
import { MemberRemoveListener } from "./listeners/member-remove-listener";
import { GoodbyMessageAndDm } from "./features/goodby-message-and-dm";
import { ClientReadyListener } from "./listeners/client-ready-listener";
import { JoinAuroraConcert } from "./features/join-aurora-concert";
import { VoiceStateUpdateListener } from "./listeners/voice-state-update-listener";
import { PlayAuroraPlaylist } from "./features/play-aurora-playlist";
import { PauseAuroraPlaylist } from "./features/pause-aurora-playlist";
import { DynamicVoiceChannelState } from "./features/dynamic-voice-channel-state";
import { discord } from "./singleton/client-singleton";
import { startCron } from "./cron/runner";
import { ChangeNicknameChannel } from "./features/change-nickname-channel";

// Load environment variables
dotenv.config();

// Register client ready listener
const clientReadyListener = new ClientReadyListener(discord());
clientReadyListener.registerFeatures([
  new JoinAuroraConcert(),
]);

// Register thread listeners
const threadListener = new ThreadCreateListener(discord());
threadListener.registerFeatures([
  new MediaOnlyForum(),
]);

// Register member add listener
const memberAddListener = new MemberAddListener(discord());
memberAddListener.registerFeatures([
  new DirectWelcomeMessage(),
  new AddRoleOnMemberJoin(),
]);

// Register member update listener
const memberUpdateListener = new MemberUpdateListener(discord());
memberUpdateListener.registerFeatures([
  new ProvinceRoleInNickname(),
  new ProvinceRoleNicknameRemove(),
]);

// Register message create listener
const messageCreateListener = new MessageCreateListener(discord());
messageCreateListener.registerFeatures([
  new DailyQuestionForward(),
  new WelcomeBannerForward(),
  new ChangeNicknameChannel(),
]);

// Register remove member listener
const memberRemoveListener = new MemberRemoveListener(discord());
memberRemoveListener.registerFeatures([
  new GoodbyMessageAndDm(),
]);

// Register voice state update listener
const voiceStateUpdateListener = new VoiceStateUpdateListener(discord());
voiceStateUpdateListener.registerFeatures([
  new PlayAuroraPlaylist(),
  new PauseAuroraPlaylist(),
  new DynamicVoiceChannelState(),
]);

// Login
discord().login(process.env.DISCORD_TOKEN)

// Start cron job
startCron();