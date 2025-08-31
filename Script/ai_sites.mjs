import { readFileSync, writeFileSync } from "fs";
import { parse, stringify } from "yaml";

const main = () => {
  let rules, rm, shared
  try {
    rules = { payload: readFileSync('../Temp/ai.txt', 'utf-8').split('\n').filter(t => t && !t.startsWith('#')) }
    add = parse(readFileSync(`../Patches/Add/AI.yaml`, "utf8"));
    rm = parse(readFileSync(`../Patches/Remove/AI.yaml`, "utf8"));
    shared = parse(readFileSync(`../Patches/Remove/Shared.yaml`, "utf8"));
  }
  catch (e) {
    console.error(e)
  }
  rules.payload = rules.payload.concat(add)
  rules.payload = rules.payload.filter(r => !rm.some(e => r.includes(e)))
  rules.payload = rules.payload.filter(r => !shared.some(e => r.includes(e)))
  try {
    writeFileSync(`../Rules/AI.yaml`, stringify(rules), "utf8");
  }
  catch (e) {
    console.error(e)
  }
}
main()