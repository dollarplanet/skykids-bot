import { AddRoleOnMemberJoin } from "../feature/action/add-role-on-member-join";
import { ChangeNicknameChannel } from "../feature/action/change-nickname-channel";
import { DailyQuestionForward } from "../feature/action/daily-question-forward";
import { DirectWelcomeMessage } from "../feature/action/direct-welcome-message";
import { DynamicVoiceChannelState } from "../feature/action/dynamic-voice-channel-state";
import { GoodbyMessageAndDm } from "../feature/action/goodby-message-and-dm";
import { MediaOnlyForum } from "../feature/action/media-only-forum";
import { ProvinceRoleInNickname } from "../feature/action/province-role-in-nickname";
import { ProvinceRoleNicknameRemove } from "../feature/action/province-role-nickname-remove";
import { SetStatus } from "../feature/action/set-status";
import { WelcomeBannerForward } from "../feature/action/welcome-banner-forward";
import { ListenerBase } from "../feature/base/listener-base";
import {featureEnum} from "@prisma/xxx-client"

const featureMap: Map<featureEnum, typeof ListenerBase> = new Map();

// Mapping feature ke class
featureMap.set(featureEnum.AddRoleOnMemberJoin, AddRoleOnMemberJoin);
featureMap.set(featureEnum.ChangeNicknameChannel, ChangeNicknameChannel);
featureMap.set(featureEnum.DailyQuestionForward, DailyQuestionForward);
featureMap.set(featureEnum.DirectWelcomeMessage, DirectWelcomeMessage);
featureMap.set(featureEnum.DynamicVoiceChannelState, DynamicVoiceChannelState);
featureMap.set(featureEnum.GoodbyMessageAndDM, GoodbyMessageAndDm);
featureMap.set(featureEnum.MediaOnlyForum, MediaOnlyForum);
featureMap.set(featureEnum.ProvinceRoleInNickname, ProvinceRoleInNickname);
featureMap.set(featureEnum.ProvinceRoleNicknameRemove, ProvinceRoleNicknameRemove);
featureMap.set(featureEnum.SetStatus, SetStatus);
featureMap.set(featureEnum.WelcomeBannerForward, WelcomeBannerForward);

export abstract class FeatureMap {
  static get(feature: featureEnum) {
    const res = featureMap.get(feature);
    if (!res) throw new Error("Feature not found");
    return res;
  }
}