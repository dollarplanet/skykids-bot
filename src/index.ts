import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { ThreadListener } from "./listeners/thread-listener";
import { MediaOnlyForum } from "./features/media-only-forum";

// Load environment variables
dotenv.config();

const {DISCORD_TOKEN} = process.env;

// Create a new client instance
const client = new Client({intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
]});

// Register thread listeners
const threadListener = new ThreadListener(client);
threadListener.registerFeatures([
  new MediaOnlyForum()
]);

// Login
client.login(DISCORD_TOKEN)