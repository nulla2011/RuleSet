import {readFileSync, writeFileSync} from "fs";
import {parse, stringify} from "yaml";

const main = () => {
  let OpenAIRules, GeminiRules, rm, shared
  try {
    OpenAIRules = parse(readFileSync(`../Temp/OpenAi.yaml`, "utf8"));
    GeminiRules = {payload: parse(readFileSync(`../Patches/Add/Gemini.yaml`, "utf8"))};
    rm = parse(readFileSync(`../Patches/Remove/AI.yaml`, "utf8"));
    shared = parse(readFileSync(`../Patches/Remove/Shared.yaml`, "utf8"));
  }
  catch (e) {
    console.error(e)
  }
  const rules = {payload: OpenAIRules.payload.concat(GeminiRules.payload)}
  rules.payload = rules.payload.filter((r)=> !rm.some((e)=> r.includes(e)))
  rules.payload = rules.payload.filter((r)=> !shared.some((e)=> r.includes(e)))
  try {
    writeFileSync(`../Rules/${site}.yaml`, stringify(rule), "utf8");
  }
  catch (e) {
    console.error(e)
  }
}
main()