import { AnyThreadChannel } from "discord.js";

export abstract class FeatureBase {}

export abstract class ThreadFeatureBase extends FeatureBase {
  public abstract action(channel: AnyThreadChannel): Promise<void>;
}