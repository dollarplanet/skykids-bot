import { AnyThreadChannel, Events } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class ThreadCreateListener extends ListenerBase {
  public abstract action(channel: AnyThreadChannel, newlyCreated: boolean): Promise<void>;

  protected registerListener() {
    discord().on(Events.ThreadCreate, (...args) => {
      try {
        this.action(...args);
      } catch {
        // do nothing
      }
    });
  }
}