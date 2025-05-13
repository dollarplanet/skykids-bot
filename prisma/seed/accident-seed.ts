import { prisma } from "../../src/singleton/prisma-singleton";

export async function accidentSeed() {
  const accidents: string[] = [
    "Kail pancingnya putus dan ikanmu berhasil kabur",
    "Sepertinya kamu tidak sengaja menumpahkan ember, ikannya jadi lepas",
    "Aduh! Kamu terpeleset ke sungai! Apakah kamu baik - baik saja?",
    "Wah, hujan lebat tiba - tiba, sebaiknya kita lupakan ikannya dan berteduh",
    "Aduh! Kamu tidak sadar ada ular disana? Lari dan lupakan ikannya!",
    "Ada pohon tumbang! Untung kamu baik - baik saja, sayang sekali ikannya harus lepas",
    "Air sungai tiba - tiba naik, pertanda buruk! lupakan saja ikannya"
  ] 

  let index = 1;

  for (const accident of accidents) {
    await prisma.accident.upsert({
      where: {
        id: index
      },
      update: {
        description: accident,
        updateAt: new Date()
      },
      create: {
        id: index,
        description: accident
      }
    })
    
    index++;
  }
}