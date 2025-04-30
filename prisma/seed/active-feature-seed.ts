import { prisma } from "../../src/singleton/prisma-singleton";
import { featureEnum } from "@prisma/xxx-client"

export async function activeFeatureSeed() {
  for (const permission of Object.values(featureEnum)) {
    await prisma.activeFeature.upsert({
      where: {
        name: permission
      },
      update: {},
      create: {
        name: permission,
      }
    });
  }
}