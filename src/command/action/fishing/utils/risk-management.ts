import { possibility, rod } from "@prisma/xxx-client";
import { shuffle } from "../../../../utils/shuffle";
import { randomPicker } from "./random-picker";


export class RiskManagement {
  constructor(private readonly wallet: number, private readonly rod: rod) {}

  public get possibility(): possibility[] {
    if (this.wallet > 200_000) {
      return shuffle(this.rod.risk200000);
    }

    if (this.wallet > 150_000) {
      return shuffle(this.rod.risk150000);
    }

    if (this.wallet > 70_000) {
      return shuffle(this.rod.risk70000);
    }

    if (this.wallet > 10_000) {
      return shuffle(this.rod.risk10000);
    }

    if (this.wallet > 5_000) {
      return shuffle(this.rod.risk5000);
    }

    if (this.wallet > 1_000) {
      return shuffle(this.rod.risk1000);
    }

    return shuffle(this.rod.risk0);
  }

  public get result(): possibility {
    return randomPicker<possibility>(["Ikan", "Ikan", "Ikan", "Ikan", "Ikan","Ikan", "Ikan", "Ikan", "Ikan", "Gagal"]);
  }

  public get luck(): possibility {
    return randomPicker(this.possibility);
  }
}