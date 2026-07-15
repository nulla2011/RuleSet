import { readFileSync, writeFileSync } from 'fs';
import { parse, stringify } from 'yaml';

const main = (ruleSet) => {
  let rules, rmList, rm, addList, add, shared;
  try {
    rules = {
      payload: readFileSync(`../Temp/${ruleSet.toLowerCase()}.txt`, 'utf-8')
        .split('\n')
        .filter((t) => t && !t.startsWith('#')),
    };
    try {
      rmList = readFileSync(`../Patches/Remove/${ruleSet}.yaml`, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        rmList = '[]';
      } else {
        console.error(error);
      }
    }
    rm = parse(rmList);
    try {
      addList = readFileSync(`../Patches/add/${ruleSet}.yaml`, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        addList = '[]';
      } else {
        console.error(error);
      }
    }
    add = parse(addList);
    shared = parse(readFileSync(`../Patches/Remove/Shared.yaml`, 'utf8'));
  } catch (e) {
    console.error(e);
  }
  rules.payload = rules.payload.filter((r) => !rm.some((e) => r.includes(e)));
  rules.payload = rules.payload.filter((r) => !shared.some((e) => r.includes(e)));
  rules.payload = rules.payload.concat(add);
  try {
    writeFileSync(`../Rules/${ruleSet}.yaml`, stringify(rules), 'utf8');
  } catch (e) {
    console.error(e);
  }
};
main(process.argv[2]);
