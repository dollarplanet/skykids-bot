import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const {DISCORD_TOKEN} = process.env;

// Create a new client instance
const client = new Client({intents: [
  GatewayIntentBits.Guilds
]})

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

// Login to Discord with your client's token
client.login(DISCORD_TOKEN)