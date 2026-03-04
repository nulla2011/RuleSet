import Axios from 'axios';
import { writeFileSync } from 'fs';
import { stringify } from 'yaml';

export default async () => {
  let data;
  try {
    data = await Axios.get('https://api.fastly.com/public-ip-list').then((res) => res.data);
  } catch (error) {
    console.error(error);
    return;
  }
  const rules = {
    payload: [
      ...data.addresses.map((l) => 'IP-CIDR,' + l),
      ...data.ipv6_addresses.map((l) => 'IP-CIDR6,' + l),
    ],
  };
  try {
    writeFileSync('../Rules/FastlyIP.yaml', stringify(rules), 'utf8');
  } catch (error) {
    console.error(error);
  }
};
