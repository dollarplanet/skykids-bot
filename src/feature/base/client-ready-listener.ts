import { Client, Events } from "discord.js";
import { discord } from "../../singleton/client-singleton";
import { ListenerBase } from "./listener-base";

export abstract class ClientReadyListener extends ListenerBase {
  public abstract action(client: Client): Promise<void>;

  protected override registerListener() {
    discord().once(Events.ClientReady, this.action);
  }
}