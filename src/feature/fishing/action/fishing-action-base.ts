import { Message, OmitPartialGroupDMChannel } from "discord.js";

export abstract class FishingActionBase {
  public abstract commands: string[];

  public abstract action(data: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void>;
}