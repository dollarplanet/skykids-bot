import dotenv from "dotenv";
import { discord } from "./singleton/client-singleton";
import { startCron } from "./cron/runner";
import { prisma } from "./singleton/prisma-singleton";
import { FeatureMap } from "./utils/feature-map";

// Load environment variables
dotenv.config();

async function init() {
  const activeFeatures = (await prisma.activeFeature.findMany({ select: { name: true } })).map(feature => feature.name);

  activeFeatures.forEach(feature => {
    const featureClass = FeatureMap.get(feature);
    new featureClass();
  })
}

// Register features
init().then(async () => {
  // Login
  await discord().login(process.env.DISCORD_TOKEN)
}).then(() => {
  // Start cron job
  startCron();
});