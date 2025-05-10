import { OmitPartialGroupDMChannel, Message } from "discord.js";
import { MessageCreateListener } from "../base/message-create-listener";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";
import { prisma } from "../../singleton/prisma-singleton";
import { FishingActionBase } from "./action/fishing-action-base";
import { BucketCheck } from "./action/bucket-check";

export class FishingListener extends MessageCreateListener {
  public async action(data: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
      // Cek fitur dimatikan
      if (await isFeatureDisabled("Fishing")) return;

      // Dapatkan config
      const config = await prisma.config.findUnique({
        where: {
          id: 1,
        },
        select: {
          fishingChannel: true
        }
      })
      if (!config) return;

      // Harus dari channel change nickname
      if (data.channelId !== config.fishingChannel) return;

      // Harus bukan bot
      if (data.author.bot) return;

      // Dapatkan pesan
      const command = data.content.toLowerCase().trim();

      // Aksi
      const actions: FishingActionBase[] = [
        new BucketCheck(),
      ]

      // Execution only use one action
      for (const action of actions) {
        if (action.commands.includes(command)) {
          await action.action(data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}