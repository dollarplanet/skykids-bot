import { prisma } from "../../src/singleton/prisma-singleton";
import { featureEnum } from "@prisma/xxx-client"

export async function activeFeatureSeed() {
  Object.values(featureEnum).forEach(async permission => {
    await prisma.activeFeature.upsert({
      where: {
        name: permission
      },
      update: {},
      create: {
        name: permission,
      }
    });
  })
}