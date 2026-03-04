import Axios from 'axios';
import { writeFileSync } from 'fs';
import { stringify } from 'yaml';

export default async () => {
  let data;
  try {
    data = await Axios.get('https://api.cloudflare.com/client/v4/ips').then((res) => res.data);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  const rules = {
    payload: [
      ...data.result['ipv4_cidrs'].map((l) => 'IP-CIDR,' + l),
      ...data.result['ipv6_cidrs'].map((l) => 'IP-CIDR6,' + l),
    ],
  };
  try {
    writeFileSync('../Rules/CloudflareIP.yaml', stringify(rules), 'utf8');
  } catch (error) {
    console.error(error);
  }
};
