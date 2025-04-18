import { createAudioResource, StreamType } from "@discordjs/voice";
import { createReadStream } from "fs";
import { join } from "path";

// Create Resources
const resourceOptions = {
  inputType: StreamType.OggOpus,
}

export const exhaleInhale = () => createAudioResource(
  createReadStream(join("assets", "aurora", "exhale-inhale.opus")),
  resourceOptions
);

export const runaway = () => createAudioResource(
  createReadStream(join("assets", "aurora", "runaway.opus")),
  resourceOptions
);

export const allSoftInside = () => createAudioResource(
  createReadStream(join("assets", "aurora", "all-soft-inside.opus")),
  resourceOptions
);

export const warior = () => createAudioResource(
  createReadStream(join("assets", "aurora", "warior.opus")),
  resourceOptions
);

export const theSeed = () => createAudioResource(
  createReadStream(join("assets", "aurora", "the-seed.opus")),
  resourceOptions
);

export const eyesOfChild = () => createAudioResource(
  createReadStream(join("assets", "aurora", "eyes-of-child.opus")),
  resourceOptions
);

export const queendom = () => createAudioResource(
  createReadStream(join("assets", "aurora", "queendom.opus")),
  resourceOptions
);

export const waterLilies = () => createAudioResource(
  createReadStream(join("assets", "aurora", "black-water-lilies.opus")),
  resourceOptions
);

export const conqueror = () => createAudioResource(
  createReadStream(join("assets", "aurora", "conqueror.opus")),
  resourceOptions
);

export const cureForMe = () => createAudioResource(
  createReadStream(join("assets", "aurora", "cure-for-me.opus")),
  resourceOptions
);

export const iWentTooFar = () => createAudioResource(
  createReadStream(join("assets", "aurora", "i-went-too-far.opus")),
  resourceOptions
);

export const lucky = () => createAudioResource(
  createReadStream(join("assets", "aurora", "lucky.opus")),
  resourceOptions
);

export const runningWithTheWolves = () => createAudioResource(
  createReadStream(join("assets", "aurora", "running-with-the-wolves.opus")),
  resourceOptions
);

export const underTheWater = () => createAudioResource(
  createReadStream(join("assets", "aurora", "under-the-water.opus")),
  resourceOptions
);

export const winterBird = () => createAudioResource(
  createReadStream(join("assets", "aurora", "winter-bird.opus")),
  resourceOptions
);