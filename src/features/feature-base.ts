import { AnyThreadChannel, GuildMember, Message, OmitPartialGroupDMChannel, PartialGuildMember } from "discord.js";

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