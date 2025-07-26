import { prisma } from "../../src/singleton/prisma-singleton";
import { possibility } from "@prisma/xxx-client";

export async function charmSeed() {
  const datas = [
    {
      id: 1,
      name: "Maneki Neko",
      price: 100,
      defaultEnergy: 5,
      image: "https://dodo.ac/np/images/d/dd/Lucky_Gold_Cat_NH_Icon.png",
      luckyPercentAdded: 10,
      risk0: ["Ikan"] as possibility[],
      risk1000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan"] as possibility[],
      risk5000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal"] as possibility[],
      risk10000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal"] as possibility[],
      risk70000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal"] as possibility[],
      risk150000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal"] as possibility[],
      risk200000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal"] as possibility[]
    },

    // {
    //   id: 2,
    //   name: "Amulet",
    //   price: 200,
    //   defaultEnergy: 5,
    //   image: "https://static.wikia.nocookie.net/shop-titans/images/1/1d/Gyatso%27s_Amulet.png",
    //   luckyPercentAdded: 20,
    //   risk0: ["Ikan"] as possibility[],
    //   risk1000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan"] as possibility[],
    //   risk5000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal"] as possibility[],
    //   risk10000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal"] as possibility[],
    //   risk70000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal", "Gagal"] as possibility[],
    //   risk150000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal", "Gagal", "Gagal"] as possibility[],
    //   risk200000: ["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal", "Gagal", "Gagal", "Gagal"] as possibility[]
    // }
  ];

  await prisma.$transaction(async (prisma) => {
    for (const data of datas) {
      await prisma.charm.upsert({
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