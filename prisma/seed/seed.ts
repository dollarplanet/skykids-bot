import { activeFeatureSeed } from "./active-feature-seed";
import { activeIntentSeed } from "./active-intent-seed";

async function main() {
  await activeFeatureSeed();
  await activeIntentSeed();
}

main();