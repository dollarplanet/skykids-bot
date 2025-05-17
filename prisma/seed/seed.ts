import { accidentSeed } from "./accident-seed";
import { activeFeatureSeed } from "./active-feature-seed";
import { charmSeed } from "./charm-seed";
import { fishSeed } from "./fish-seed";
import { rodSeed } from "./rod-seed";

async function main() {
  await activeFeatureSeed();
  await fishSeed();
  await rodSeed();
  await accidentSeed();
  await charmSeed();
}

main();