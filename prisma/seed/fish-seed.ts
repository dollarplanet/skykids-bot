import { prisma } from "../../src/singleton/prisma-singleton";

export async function fishSeed() {
  const fishJson = await import('./fish.json', {
    assert: {
      type: 'json'
    }
  })
  const fishList = fishJson.default

  for (const fish of fishList) {
    await prisma.fish.upsert({
      where: {
        id: fish.id
      },
      update: {
        name: fish.name,
        image: fish.image,
        rarity: fish.rarity as any,
        price: fish.price,
        time: fish.time,
        months: fish.months,
        updateAt: new Date()
      },
      create: {
        id: fish.id,
        name: fish.name,
        image: fish.image,
        rarity: fish.rarity as any,
        price: fish.price,
        time: fish.time,
        months: fish.months
      }
    })
  }
}