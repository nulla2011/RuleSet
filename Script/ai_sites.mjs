import {readFileSync, writeFileSync} from "fs";
import {parse, stringify} from "yaml";

const main = () => {
  let OpenAIRules, ClaudeRules, GeminiRules, rm, shared
  try {
    OpenAIRules = parse(readFileSync(`../Temp/OpenAI.yaml`, "utf8"));
    ClaudeRules = parse(readFileSync(`../Temp/Claude.yaml`, "utf8"));
    GeminiRules = {payload: parse(readFileSync(`../Patches/Add/Gemini.yaml`, "utf8"))};
    rm = parse(readFileSync(`../Patches/Remove/AI.yaml`, "utf8"));
    shared = parse(readFileSync(`../Patches/Remove/Shared.yaml`, "utf8"));
  }
  catch (e) {
    console.error(e)
  }
  const rules = {payload: OpenAIRules.payload.concat(GeminiRules.payload).concat(ClaudeRules.payload)}
  rules.payload = rules.payload.filter((r)=> !rm.some((e)=> r.includes(e)))
  rules.payload = rules.payload.filter((r)=> !shared.some((e)=> r.includes(e)))
  try {
    writeFileSync(`../Rules/AI.yaml`, stringify(rules), "utf8");
  }
  catch (e) {
    console.error(e)
  }
}
main()