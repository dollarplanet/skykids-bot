import { Client, Events, GatewayIntentBits } from "discord.js";
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
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType } from "@discordjs/voice";
import { createReadStream } from "fs";
import { join } from "path";

// Load environment variables
dotenv.config();

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

// Register thread listeners
const threadListener = new ThreadCreateListener(client);
threadListener.registerFeatures([
  new MediaOnlyForum(),
]);

// Register member add listener
const memberAddListener = new MemberAddListener(client);
memberAddListener.registerFeatures([
  new DirectWelcomeMessage(),
  new AddRoleOnMemberJoin(),
]);

// Register member update listener
const memberUpdateListener = new MemberUpdateListener(client);
memberUpdateListener.registerFeatures([
  new ProvinceRoleInNickname(),
  new ProvinceRoleNicknameRemove(),
]);

// Register message create listener
const messageCreateListener = new MessageCreateListener(client);
messageCreateListener.registerFeatures([
  new DailyQuestionForward(),
  new WelcomeBannerForward(),
]);

// Register remove member listener
const memberRemoveListener = new MemberRemoveListener(client);
memberRemoveListener.registerFeatures([
  new GoodbyMessageAndDm(),
]);

client.on(Events.ClientReady, async () => {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  const channelId = "1362351596675137687";
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

    const runaway = createAudioResource(createReadStream(join("assets", "aurora", "runaway.opus")), {
      inputType: StreamType.OggOpus,
    });

    await delay(5000);

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    connection.subscribe(player);
    player.play(runaway);


    break;
  }

});

// Login
client.login(process.env.DISCORD_TOKEN)