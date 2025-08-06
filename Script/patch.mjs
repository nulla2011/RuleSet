import {readFileSync, writeFileSync, existsSync} from "fs";
import {parse, stringify} from "yaml";

const main = (site) => {
  let rules, rm, shared
  try {
    rules = parse(readFileSync(`../Temp/${site}.yaml`, "utf8"));
    if (existsSync(`../Patches/Remove/${site}.yaml`)){
      rm = parse(readFileSync(`../Patches/Remove/${site}.yaml`, "utf8"));
    }
    else rm = []
    shared = parse(readFileSync(`../Patches/Remove/Shared.yaml`, "utf8"));
  }
  catch (e) {
    console.error(e)
  }
  rules.payload = rules.payload.filter((r)=> !rm.some((e)=> r.includes(e)))
  rules.payload = rules.payload.filter((r)=> !shared.some((e)=> r.includes(e)))
  try {
    writeFileSync(`../Rules/${site}.yaml`, stringify(rules), "utf8");
  }
  catch (e) {
    console.error(e)
  }
}
main(process.argv[2])