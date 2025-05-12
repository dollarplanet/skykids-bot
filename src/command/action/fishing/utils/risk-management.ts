import { shuffle } from "../../../../utils/shuffle";
import { randomPicker } from "./random-picker";


export type Possibility = "Ikan" | "Sampah" | "Tanaman";

export class RiskManagement {
  constructor(private readonly wallet: number) {}

  public get possibility(): Possibility[] {
    if (this.wallet < 1000 ) {
      return ["Ikan"]
    }

    if (this.wallet < 5000) {
      return shuffle(["Ikan", "Ikan", "Ikan", "Ikan", "Sampah", "Tanaman"])
    }

    if (this.wallet < 10000) {
      return shuffle(["Ikan", "Ikan", "Ikan", "Sampah", "Tanaman"])
    }

    if (this.wallet < 70000) {
      return shuffle(["Ikan", "Ikan", "Sampah", "Tanaman"])
    }

    return shuffle(["Ikan", "Sampah", "Tanaman"])
  }

  public get result(): Possibility {
    return randomPicker(this.possibility);
  }
}