import { writeFileSync } from "fs";
import https from "https";
import { parse, stringify } from "yaml";

const REMOVE_RULES = ['\U0001F3AC 国际流媒体', '\U0001F3AC 大陆流媒体国际版', '\U0001F3AE 游戏平台', '\U0001F3AC 大陆流媒体']

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
  const config = parse(await data)
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
  config.dns['use-system-hosts'] = true;
  Object.assign(config['rule-providers'], {
    global: {
      type: 'http',
      behavior: 'classical',
      path: './ruleset/global.yaml',
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
    AI: {
      type: 'http',
      behavior: 'classical',
      path: './ruleset/AI.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/ruleset@master/rules/AI.yaml',
      interval: 86400,
    },
    JP: {
      type: 'http',
      behavior: 'classical',
      path: './ruleset/JP.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/ruleset@master/rules/JP.yaml',
      interval: 86400,
    },
    DirectEx: {
      type: 'http',
      behavior: 'classical',
      path: './ruleset/AI.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/ruleset@master/rules/DirectEx.yaml',
      interval: 86400,
    },
    AdobeBan: {
      type: 'http',
      behavior: 'classical',
      path: './ruleset/AI.yaml',
      url: 'https://gcore.jsdelivr.net/gh/nulla2011/ruleset@master/rules/Adobe_ban.yaml',
      interval: 86400,
    }
  })
  config['proxy-groups'] = config['proxy-groups'].filter(e => !REMOVE_RULES.includes(e.name))
  config.rules = config.rules.filter(e => !REMOVE_RULES.some(r => e.includes(r)))
  const { GlobalMedia, AsianMedia, Game, ChinaMedia, ...rest } = config['rule-providers']
  config['rule-providers'] = rest
  config['proxy-groups'].splice(5, 0, {
    name: 'AI',
    type: 'select',
    proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵'), '➡️ 直接连接'],
  });
  config['proxy-groups'].splice(3, 0, {
    name: 'ニコニコ',
    type: 'select',
    proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵'), '➡️ 直接连接'],
  });
  config['proxy-groups'].splice(6, 0, {
    name: 'AbemaTV',
    type: 'select',
    proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵'), '➡️ 直接连接'],
  });
  config['proxy-groups'].splice(7, 0, {
    name: 'Bahamut',
    type: 'select',
    proxies: ['🌐 国外流量', ...proxiesNameFilter('🇹🇼'), '➡️ 直接连接'],
  });
  config['proxy-groups'].splice(4, 0, {
    name: 'YouTube',
    type: 'select',
    proxies: ['🌐 国外流量', ...proxiesNameFilter(''), '➡️ 直接连接'],
  });
  config['proxy-groups'].splice(6, 0, {
    name: 'Spotify',
    type: 'select',
    proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵'), '➡️ 直接连接'],
  });
  config['proxy-groups'].splice(11, 0, {
    name: 'JP',
    type: 'select',
    proxies: ['🌐 国外流量', ...proxiesNameFilter('🇯🇵'), '➡️ 直接连接'],
  });
  config.rules.unshift('RULE-SET,Niconico,ニコニコ');
  config.rules.unshift('RULE-SET,AbemaTV,AbemaTV');
  config.rules.unshift('RULE-SET,Bahamut,Bahamut');
  config.rules.unshift('RULE-SET,Spotify,Spotify');
  config.rules.unshift('RULE-SET,YouTube,YouTube');
  config.rules.unshift('RULE-SET,AI,AI');
  config.rules.unshift('RULE-SET,JP,JP');
  config.rules.unshift('RULE-SET,AdobeBan,REJECT');

  writeFileSync('C:/users/nulla/desktop/d61638864fd63165', stringify(config), 'utf-8')
}
main()