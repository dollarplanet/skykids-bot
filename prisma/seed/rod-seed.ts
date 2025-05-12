import { prisma } from "../../src/singleton/prisma-singleton";
import { possibility } from "@prisma/xxx-client";

export async function rodSeed() {
  const datas = [
    {
      id: 1,
      name: "Joran Bambu",
      price: 500,
      defaultEnergy: 5,
      image: "https://dodo.ac/np/images/a/a1/Fishing_Rod_%28Blue%29_NH_Icon.png",
      possibilityPercentAdded: 0,
      risk0: ["Ikan"] as possibility[],
      risk1000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk5000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk10000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk70000: ["Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk150000: ["Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk200000: ["Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[],
    },
    {
      id: 2,
      name: "Joran Fiber",
      price: 750,
      defaultEnergy: 5,
      image: "https://dodo.ac/np/images/6/6f/Fish_Fishing_Rod_%28Green%29_NH_Icon.png",
      possibilityPercentAdded: 10,
      risk0: ["Ikan"] as possibility[],
      risk1000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah"] as possibility[],
      risk5000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk10000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk70000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk150000: ["Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk200000: ["Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[]
    },

    {
      id: 3,
      name: "Joran Carbon",
      price: 1000,
      defaultEnergy: 5,
      image: "https://static.wikia.nocookie.net/animalcrossing/images/7/7d/NH-Tools-Fish_Fishing_Rod_%28blue%29.png",
      possibilityPercentAdded: 20,
      risk0: ["Ikan"] as possibility[],
      risk1000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah"] as possibility[],
      risk5000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah"] as possibility[],
      risk10000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk70000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk150000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[],
      risk200000: ["Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah", "Sampah"] as possibility[]
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