import { AnyThreadChannel, Client, GuildMember, Message, OmitPartialGroupDMChannel, PartialGuildMember, VoiceState } from "discord.js";

export abstract class FeatureBase {}

export abstract class ThreadFeatureBase extends FeatureBase {
  public abstract action(channel: AnyThreadChannel, newlyCreated: boolean): Promise<void>;
}

export abstract class MemberAddFeatureBase extends FeatureBase {
  public abstract action(member: GuildMember): Promise<void>;
}

export abstract class MemberUpdateFeatureBase extends FeatureBase {
  public abstract action(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember): Promise<void>;
}

export abstract class MessageCreateFeatureBase extends FeatureBase {
  public abstract action(data: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void>;
}

export abstract class MemberRemoveFeatureBase extends FeatureBase {
  public abstract action(member: GuildMember | PartialGuildMember): Promise<void>;
}

export abstract class ClientReadyFeatureBase extends FeatureBase {
  public abstract action(client: Client): Promise<void>;
}

export abstract class VoiceStateUpdateFeatureBase extends FeatureBase {
  public abstract action(oldState: VoiceState, newState: VoiceState): Promise<void>;
}