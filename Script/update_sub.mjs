import { writeFileSync } from "fs";
import https from "https";
import { parse, stringify } from "yaml";

const REMOVE_RULES = ['🎬 国际流媒体', '🎬 大陆流媒体国际版', '🎮 游戏平台', '🎬 大陆流媒体']

const data = new Promise((resolve, reject) => {
  https.get(process.env.SUB_URL, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      resolve(data);
    });
  }).on('error', (err) => {
    reject(err);
  })
})

const main = async () => {
  let config = parse(await data)
  config = patchProfile(config)
  writeFileSync('C:/users/nulla/desktop/d61638864fd63165', stringify(config), 'utf-8')
}

export const patchProfile = (config) => {
  const addRules = (domains, proxy = '🌐 国外流量', type = 'DOMAIN-SUFFIX') => {
    domains.map((domain) => config.rules.unshift(`${type.toUpperCase()},${domain},${proxy}`));
  };
  const proxiesNameFilter = (...kws) => {
    return config.proxies
      .filter((proxy) => kws.every((kw) => proxy.name.includes(kw)))
      .map((p) => p.name);
  };

  config['geox-url'] = {
    geoip: "https://gcore.jsdelivr.net/gh/metacubex/meta-rules-dat@release/geoip.dat",
    geosite: "https://gcore.jsdelivr.net/gh/metacubex/meta-rules-dat@release/geosite.dat",
    mmdb: "https://gcore.jsdelivr.net/gh/metacubex/meta-rules-dat@release/geoip.metadb"
  }
  delete config.dns.fallback
  config.dns['nameserver-policy']['rule-set:Global'] = [
    'https://dns.google/dns-query#🌐 国外流量',
    'https://cloudflare-dns.com/dns-query#🌐 国外流量',
    '8.8.8.8#🌐 国外流量',
    '1.1.1.1#🌐 国外流量',
  ];
  config.dns['nameserver-policy']['rule-set:Direct,China'] = config.dns['nameserver-policy']['rule-set:Direct,ChinaMedia,China']
  delete config.dns['nameserver-policy']['rule-set:Direct,ChinaMedia,China']
  config.dns['use-system-hosts'] = true;
  Object.assign(config['rule-providers'], {
    Global: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/Global.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/Proxy.yaml',
      interval: 86400,
    },
    Niconico: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/StreamingMedia/Video/niconico.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/Niconico.yaml',
      interval: 86400,
    },
    AbemaTV: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/StreamingMedia/Video/AbemaTV.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/AbemaTV.yaml',
      interval: 86400,
    },
    Bahamut: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/StreamingMedia/Video/Bahamut.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/Bahamut.yaml',
      interval: 86400,
    },
    Spotify: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/StreamingMedia/Music/Spotify.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/Spotify.yaml',
      interval: 86400,
    },
    YouTube: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/StreamingMedia/Video/YouTube.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/YouTube.yaml',
      interval: 86400,
    },
    TikTok: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/StreamingMedia/Video/TikTok.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/TikTok.yaml',
      interval: 86400,
    },
    AI: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/AI.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/AI.yaml',
      interval: 86400,
    },
    JP: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/JP.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/JP.yaml',
      interval: 86400,
    },
    DirectEx: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/DirectEx.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/DirectEx.yaml',
      interval: 86400,
    },
    AdobeBan: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/AdobeBan.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/Adobe_ban.yaml',
      interval: 86400,
    },
    BlockChina: {
      type: 'http',
      behavior: 'classical',
      path: './RuleSet/BlockChina.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/RuleSet@master/Rules/Block_China.yaml',
      interval: 86400,
    },
  })
  config['proxy-groups'] = config['proxy-groups'].filter(e => !REMOVE_RULES.includes(e.name))
  config.rules = config.rules.filter(e => !REMOVE_RULES.some(r => e.includes(r)))
  const { GlobalMedia, AsianMedia, Game, ChinaMedia, ...rest } = config['rule-providers']
  config['rule-providers'] = rest
  config['proxy-groups'].splice(2, 0,
    {
      name: 'AI',
      type: 'select',
      proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵'), ...proxiesNameFilter('🇺🇸'), '➡️ 直接连接'],
    },
    {
      name: 'YouTube',
      type: 'select',
      proxies: ['🌐 国外流量', ...proxiesNameFilter('')],
    },
    {
      name: 'Spotify',
      type: 'select',
      proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵'), '➡️ 直接连接'],
    },
    {
      name: 'ニコニコ',
      type: 'select',
      proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵')],
    },
    {
      name: 'TikTok',
      type: 'select',
      proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵'), ...proxiesNameFilter('🇺🇸'), '➡️ 直接连接'],
    },
    {
      name: 'Bahamut',
      type: 'select',
      proxies: ['🌐 国外流量', ...proxiesNameFilter('🇹🇼'), '➡️ 直接连接'],
    },
    {
      name: 'AbemaTV',
      type: 'select',
      proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵')],
    },
    {
      name: 'JP',
      type: 'select',
      proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵')],
    }
  );
  config.rules = ['RULE-SET,BlockChina,🌐 国际网站',
    'RULE-SET,DirectEx,DIRECT',
    'RULE-SET,AdobeBan,REJECT',
    'RULE-SET,JP,JP',
    'RULE-SET,AI,AI',
    'RULE-SET,TikTok,TikTok',
    'RULE-SET,YouTube,YouTube',
    'RULE-SET,Spotify,Spotify',
    'RULE-SET,Bahamut,Bahamut',
    'RULE-SET,AbemaTV,AbemaTV',
    'RULE-SET,Niconico,ニコニコ'].concat(config.rules)
  Object.assign(config, {
    'geodata-mode': true,
    'tcp-concurrent': true
  })
  return config
}
main()