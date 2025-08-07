import { readFileSync, writeFileSync } from "fs";
import { parse, stringify } from "yaml";

const main = () => {
  let rules, add, rm, shared
  try {
    rules = parse(readFileSync(`../Temp/Proxy_Classical.yaml`, "utf8"));
    add = parse(readFileSync(`../Patches/Add/Proxy.yaml`, "utf8"));
    rm = parse(readFileSync(`../Patches/Remove/Proxy.yaml`, "utf8"));
    shared = parse(readFileSync(`../Patches/Remove/Shared.yaml`, "utf8"));
  }
  catch (e) {
    console.error(e)
  }
  rules.payload = rules.payload.concat(add)
  rules.payload = rules.payload.filter(r => !rm.some(e => r.includes(e)))
  rules.payload = rules.payload.filter(r => !shared.some(e => r.includes(e)))
  try {
    writeFileSync(`../Rules/Proxy.yaml`, stringify(rules), "utf8");
  }
  catch (e) {
    console.error(e)
  }
}
main()