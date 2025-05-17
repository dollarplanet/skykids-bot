import { rarity, rod } from "@prisma/xxx-client";

export class RarityManagement {
  constructor(private readonly rod: rod) { }

  public result(rarity: rarity): number {
    switch (rarity) {
      case "Langka":
        return this.rod.langka;
      case "Mahal":
        return this.rod.mahal;
      case "Bagus":
        return this.rod.bagus;
      case "Biasa":
        return this.rod.biasa;
      case "Murahan":
        return this.rod.murahan;
    }
  }
}