import {translate} from "free-translate";

export async function translator(text: string) {
  try {
    const res = await translate(text, {to: "id", from: "en"});
    return res;
  } catch {
    return text;
  }
}