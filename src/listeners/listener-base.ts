import { Client } from "discord.js";
import { FeatureBase } from "../features/feature-base";

export abstract class ListenerBase {
  public constructor(
    protected client: Client
  ) {}

  public abstract registerFeatures(
    features: FeatureBase[]
  ): Promise<void>;
}