import { Interaction, MessageFlags } from "discord.js";
import { CommandBase } from "./command-base";
import { isFeatureDisabled } from "../../utils/is-feature-disabled";
import { triviaEnglish } from "../../cron/trivia-english";

export class GetTriviaCommand extends CommandBase {
  protected name: string = "get-trivia";
  protected description: string = "Kirim trivia ke channelnya";

  public async action(interaction: Interaction) {
    try {
      // Cek apakah pisa di reply
      if (!interaction.isRepliable()) return;

      // Cek apakah fitur aktif
      if (await isFeatureDisabled("Trivia")) {
        await interaction.reply({
          content: "Fitur Trivia belum aktif",
          flags: MessageFlags.Ephemeral
        })
        return;
      };

      // Generate trivia
      triviaEnglish();

      await interaction.reply({
        content: "Trivia sedang diproses",
        flags: MessageFlags.Ephemeral
      })
    } catch {
      //
    }
  }

}