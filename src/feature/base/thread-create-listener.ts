import { AnyThreadChannel, Events } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class ThreadCreateListener extends ListenerBase {
  public abstract action(channel: AnyThreadChannel, newlyCreated: boolean): Promise<void>;

  protected override async registerListener() {
    (await discord()).on(Events.ThreadCreate, this.action);
  }
}