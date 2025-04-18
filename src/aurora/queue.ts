import { AudioResource } from "@discordjs/voice";
import { allSoftInside, conqueror, cureForMe, exhaleInhale, eyesOfChild, iWentTooFar, lucky, queendom, runaway, runningWithTheWolves, theSeed, underTheWater, warior, waterLilies, winterBird } from "./resources";

// Index management
let index = -1;

// Queue Management
let auroraQueue : AudioResource[] = [];

function resetQueue(): AudioResource[] {
  index = -1;
  auroraQueue = [
    exhaleInhale(),
    runaway(),
    allSoftInside(),
    warior(),
    theSeed(),
    eyesOfChild(),
    queendom(),
    waterLilies(),
    conqueror(),
    cureForMe(),
    iWentTooFar(),
    lucky(),
    runningWithTheWolves(),
    underTheWater(),
    winterBird(),
  ];
  
  return auroraQueue;
}

export function nextSong(): AudioResource {
  // Reset queue jika kosong
  if (auroraQueue.length === 0) {
    resetQueue();
  }

  // Reset queue jika lagu terakhir
  if (index === auroraQueue.length - 1) {
    resetQueue();
  }

  index = index + 1;
  return auroraQueue[index];
}