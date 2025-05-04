import { featureEnum } from "@prisma/xxx-client";
import { prisma } from "../singleton/prisma-singleton";

export async function isFeatureDisabled(feature: featureEnum) {
  const res = await prisma.activeFeature.count({ where: { name: feature } });

  return res === 0;
}