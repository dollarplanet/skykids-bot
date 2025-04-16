import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { ThreadListener } from "./listeners/thread-listener";
import { MediaOnlyForum } from "./features/media-only-forum";
import { MemberJoinListener } from "./listeners/member-join-listener";

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
const threadListener = new ThreadListener(client);
threadListener.registerFeatures([
  new MediaOnlyForum()
]);

// Register member join listener
const memberJoinListener = new MemberJoinListener(client);
memberJoinListener.registerFeatures();

// Login
client.login(process.env.DISCORD_TOKEN)