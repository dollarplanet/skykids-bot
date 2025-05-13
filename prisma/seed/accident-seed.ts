import { prisma } from "../../src/singleton/prisma-singleton";

export async function accidentSeed() {
  const accidents: string[] = [
    "Kail pancingnya putus dan ikanmu berhasil kabur",
    "Sepertinya kamu tidak sengaja menumpahkan ember, ikannya jadi lepas",
    "Aduh! Kamu terpeleset ke sungai! Apakah kamu baik - baik saja?",
    "Wah, hujan lebat tiba - tiba, sebaiknya kita lupakan ikannya dan berteduh",
    "Aduh! Kamu tidak sadar ada ular disana? Lari dan lupakan ikannya!",
    "Ada pohon tumbang! Untung kamu baik - baik saja, sayang sekali ikannya harus lepas",
    "Air sungai tiba - tiba naik, pertanda buruk! lupakan saja ikannya",
    "Penyihir datang dan kamu dikutuk! Apakah kamu mau lupakan ikannya?",
    "Lihat disana! Ada raksasa sedang mengamuk, cepat panggil ultraman dan lupakan ikannya!",
    "Kamu terperosok ke lumpur hisap! Bertahanlah, bantuan akan segera datang!",
    "Ikan yang kamu tangkap terpapar radiasi kuat! Cepat lepaskan!",
    "Kamu terkena patil ikan, tangan kamu besar sebelah, lupakan ikannya dan bertahanlah",
    "Aduh! Kamu terkena kail pancing, lupakan ikannya dan cepat lepaskan kailnya",
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