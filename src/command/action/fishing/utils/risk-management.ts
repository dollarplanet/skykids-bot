import { possibility, charm } from "@prisma/xxx-client";
import { shuffle } from "../../../../utils/shuffle";
import { randomPicker } from "./random-picker";


export class RiskManagement {
  constructor(private readonly wallet: number, private readonly charm: charm | null | undefined) { }

  private get noCharmRisk(): possibility[] {
    if (this.wallet > 200_000) {
      return shuffle(["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal", "Gagal"]);
    }

    if (this.wallet > 150_000) {
      return shuffle(["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal", "Gagal"]);
    }

    if (this.wallet > 70_000) {
      return shuffle(["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal"]);
    }

    if (this.wallet > 10_000) {
      return shuffle(["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal"]);
    }

    if (this.wallet > 5_000) {
      return shuffle(["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal", "Gagal"]);
    }

    if (this.wallet > 1_000) {
      return shuffle(["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal"]);
    }

    return shuffle(["Ikan"]);
  }

  public get possibility(): possibility[] {
    if ((this.charm === null) || (this.charm === undefined)) {
      return this.noCharmRisk;
    };

    if (this.wallet > 200_000) {
      return shuffle(this.charm.risk200000);
    }

    if (this.wallet > 150_000) {
      return shuffle(this.charm.risk150000);
    }

    if (this.wallet > 70_000) {
      return shuffle(this.charm.risk70000);
    }

    if (this.wallet > 10_000) {
      return shuffle(this.charm.risk10000);
    }

    if (this.wallet > 5_000) {
      return shuffle(this.charm.risk5000);
    }

    if (this.wallet > 1_000) {
      return shuffle(this.charm.risk1000);
    }

    return shuffle(this.charm.risk0);
  }

  public get result(): possibility {
    if (this.wallet < 1_000) {
      return "Ikan";
    }

    return randomPicker<possibility>(["Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Ikan", "Gagal"]);
  }

  public get luck(): possibility {
    return randomPicker(this.possibility);
  }
}