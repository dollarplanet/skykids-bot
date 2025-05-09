import { activeFeatureSeed } from "./active-feature-seed";
import { fishSeed } from "./fish-seed";

async function main() {
  await activeFeatureSeed();
  await fishSeed();
}

main();