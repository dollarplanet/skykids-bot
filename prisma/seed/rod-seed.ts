import { prisma } from "../../src/singleton/prisma-singleton";


export async function rodSeed() {
  const datas = [
    {
      id: 1,
      name: "Joran Bambu",
      price: 500,
      defaultEnergy: 5,
      image: "https://dodo.ac/np/images/a/a1/Fishing_Rod_%28Blue%29_NH_Icon.png",
      possibilityPercentAdded: 0,
      murahan: 10,
      biasa: 9,
      bagus: 6,
      mahal: 3,
      langka: 1
    },
    {
      id: 2,
      name: "Joran Fiber",
      price: 750,
      defaultEnergy: 5,
      image: "https://dodo.ac/np/images/6/6f/Fish_Fishing_Rod_%28Green%29_NH_Icon.png",
      possibilityPercentAdded: 10,
      murahan: 8,
      biasa: 6,
      bagus: 4,
      mahal: 3,
      langka: 2
    },

    {
      id: 3,
      name: "Joran Carbon",
      price: 1000,
      defaultEnergy: 5,
      image: "https://static.wikia.nocookie.net/animalcrossing/images/7/7d/NH-Tools-Fish_Fishing_Rod_%28blue%29.png",
      possibilityPercentAdded: 20,
      murahan: 6,
      biasa: 4,
      bagus: 3,
      mahal: 3,
      langka: 3
    }
  ];

  await prisma.$transaction(async (prisma) => {
    for (const data of datas) {
      await prisma.rod.upsert({
        where: {
          id: data.id,
        },
        create: data,
        update: {
          ...data,
          updateAt: new Date()
        }
      });
    }
  });
}