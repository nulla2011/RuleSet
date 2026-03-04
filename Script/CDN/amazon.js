import Axios from 'axios';
import { writeFileSync } from 'fs';
import { stringify } from 'yaml';

export default async () => {
  let data;
  try {
    data = await Axios.get('https://ip-ranges.amazonaws.com/ip-ranges.json').then(
      (res) => res.data
    );
  } catch (error) {
    console.error(error);
    return;
  }
  const awsV4CIDR = data.prefixes.filter((el) => el.service === 'AMAZON').map((el) => el.ip_prefix);
  const awsV6CIDR = data.ipv6_prefixes
    .filter((el) => el.service === 'AMAZON')
    .map((el) => el.ipv6_prefix);
  const cloudfrontV4CIDR = data.prefixes
    .filter((el) => el.service === 'CLOUDFRONT')
    .map((el) => el.ip_prefix);
  const cloudfrontV6CIDR = data.ipv6_prefixes
    .filter((el) => el.service === 'CLOUDFRONT')
    .map((el) => el.ipv6_prefix);
  const awsRules = {
    payload: [...awsV4CIDR.map((l) => 'IP-CIDR,' + l), ...awsV6CIDR.map((l) => 'IP-CIDR6,' + l)],
  };
  const cloudfrontRules = {
    payload: [
      ...cloudfrontV4CIDR.map((l) => 'IP-CIDR,' + l),
      ...cloudfrontV6CIDR.map((l) => 'IP-CIDR6,' + l),
    ],
  };
  try {
    writeFileSync('../Rules/AwsIP.yaml', stringify(awsRules), 'utf8');
    writeFileSync('../Rules/CloudfrontIP.yaml', stringify(cloudfrontRules), 'utf8');
  } catch (error) {
    console.error(error);
  }
};
