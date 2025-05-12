import { activeFeatureSeed } from "./active-feature-seed";
import { fishSeed } from "./fish-seed";
import { rodSeed } from "./rod-seed";

async function main() {
  await activeFeatureSeed();
  await fishSeed();
  await rodSeed();
}

main();