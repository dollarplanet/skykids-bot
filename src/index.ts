import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { ThreadCreateListener } from "./listeners/thread-create-listener";
import { MediaOnlyForum } from "./features/media-only-forum";
import { MemberAddListener } from "./listeners/member-add-listener";
import { DirectWelcomeMessage } from "./features/direct-welcome-message";
import { MemberUpdateListener } from "./listeners/member-update-listener";
import { ProvinceRoleInNickname } from "./features/province-role-in-nickname";
import { ProvinceRoleNicknameRemove } from "./features/province-role-nickname-remove";

// Load environment variables
dotenv.config();

// Create a new client instance
const client = new Client({intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
]});

// Register thread listeners
const threadListener = new ThreadCreateListener(client);
threadListener.registerFeatures([
  new MediaOnlyForum()
]);

// Register member add listener
const memberAddListener = new MemberAddListener(client);
memberAddListener.registerFeatures([
  new DirectWelcomeMessage()
]);

// Register member update listener
const memberUpdateListener = new MemberUpdateListener(client);
memberUpdateListener.registerFeatures([
  new ProvinceRoleInNickname(),
  new ProvinceRoleNicknameRemove(),
]);

// Login
client.login(process.env.DISCORD_TOKEN)