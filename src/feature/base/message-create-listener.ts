import { Events, Message, OmitPartialGroupDMChannel } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class MessageCreateListener extends ListenerBase {
  public abstract action(data: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void>;

  protected override async registerListener() {
    discord().on(Events.MessageCreate, this.action);
  }}