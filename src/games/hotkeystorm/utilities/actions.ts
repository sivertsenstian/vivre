import _map from 'lodash/map';
import _flatten from 'lodash/flatten';

export enum HotKeyType {
  Basic = 'Basic',
  Target = 'Target',
  Use = 'Use',
  Dodge = 'Dodge',
  Train = 'Train',
  NightElfBuild = 'NightElfBuild ',
}

export const Basic: any = {
  HeroAbilities: { code: 'cmdselectskill', types: [HotKeyType.Basic] },
  NightElfBuild: { code: 'cmdbuildnightelf', types: [HotKeyType.Basic] },
  TargetDummy: 'TARGETDUMMY',
  MissileDodge: 'MISSILEDODGE',
  Miss: 'MISS',
};

export const Inventory: any = {
  Item1: {
    'Scroll Of Town Portal': {
      code: 'itm1',
      types: [HotKeyType.Target, HotKeyType.Use],
    },
  },
  Item2: {
    'Staff Of Preservation': { code: 'itm2', types: [HotKeyType.Target] },
    'Potion of Lesser Invulnerability': {
      code: 'itm2',
      types: [HotKeyType.Basic, HotKeyType.Dodge],
    },
  },
  Item4: {
    'Potion of Lesser Invulnerability': {
      code: 'itm4',
      types: [HotKeyType.Basic, HotKeyType.Dodge],
    },
  },
};

export const NightElf: any = {
  'Demon Hunter': {
    'Mana Burn': { code: 'aemb', types: [HotKeyType.Target, HotKeyType.Train] },
    Immolation: { code: 'aeim', types: [HotKeyType.Basic, HotKeyType.Train] },
    Evasion: { code: 'aeev', types: [HotKeyType.Train] },
    Metamorphosis: {
      code: 'aeme',
      types: [HotKeyType.Basic, HotKeyType.Train],
    },
  },
  'Keeper Of The Grove': {
    'Entangling Roots': {
      code: 'aeer',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Force Of Nature': {
      code: 'aefn',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Thorns Aura': { code: 'aeah', types: [HotKeyType.Train] },
    Tranquility: { code: 'aetq', types: [HotKeyType.Basic, HotKeyType.Train] },
  },
  'Priestess of the Moon': {
    Scout: { code: 'aest', types: [HotKeyType.Basic, HotKeyType.Train] },
    'Searing Arrows': { code: 'ahfa', types: [HotKeyType.Train] },
    'Trueshot Aura': { code: 'aear', types: [HotKeyType.Train] },
    Starfall: { code: 'aesf', types: [HotKeyType.Basic] },
    Shadowmeld: { code: 'ashm', types: [HotKeyType.Basic] },
  },
  Warden: {
    'Fan of Knives': {
      code: 'aefk',
      types: [HotKeyType.Basic, HotKeyType.Train],
    },
    Blink: { code: 'aebl', types: [HotKeyType.Target, HotKeyType.Train] },
    'Shadow Strike': {
      code: 'aesh',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    Vengeance: { code: 'aesv', types: [HotKeyType.Basic, HotKeyType.Train] },
    Shadowmeld: { code: 'ashm', types: [HotKeyType.Basic] },
  },

  Wisp: {
    Renew: { code: 'aren', types: [HotKeyType.Target] },
    Detonate: { code: 'adtn', types: [HotKeyType.Target] },
    'Tree Of Life': { code: 'etol', types: [HotKeyType.NightElfBuild] },
    'Ancient Of War': { code: 'eaom', types: [HotKeyType.NightElfBuild] },
    'Hunter’s Hall': { code: 'edob', types: [HotKeyType.NightElfBuild] },
    'Ancient Protector': { code: 'etrp', types: [HotKeyType.NightElfBuild] },
    'Moon Well': { code: 'emow', types: [HotKeyType.NightElfBuild] },
    'Altar Of Elders': { code: 'eate', types: [HotKeyType.NightElfBuild] },
    'Ancient Of Lore': { code: 'eaoe', types: [HotKeyType.NightElfBuild] },
    'Ancient Of Wind': { code: 'eaow', types: [HotKeyType.NightElfBuild] },
    'Chimaera Roost': { code: 'edos', types: [HotKeyType.NightElfBuild] },
    'Ancient Of Wonders': { code: 'eden', types: [HotKeyType.NightElfBuild] },
  },
  Archer: {
    'Mount Hippogryph': { code: 'aco2', types: [HotKeyType.Basic] },
    Shadowmeld: { code: 'ashm', types: [HotKeyType.Basic] },
  },
  Huntress: {
    Sentinel: { code: 'aesn', types: [HotKeyType.Target] },
    Shadowmeld: { code: 'ashm', types: [HotKeyType.Basic] },
  },
  'Glaive Thrower': {
    'Attack Ground': { code: 'cmdattackground', types: [HotKeyType.Target] },
  },
  Dryad: { 'Abolish Magic': { code: 'aadm', types: [HotKeyType.Target] } },
  'Druid Of The Claw': {
    Roar: { code: 'aroa', types: [HotKeyType.Basic] },
    Rejuvenation: { code: 'arej', types: [HotKeyType.Target] },
    'Bear Form': { code: 'abrf', types: [HotKeyType.Basic] },
  },
  'Mountain Giant': {
    Taunt: { code: 'atau', types: [HotKeyType.Basic] },
    'War Club': { code: 'agra', types: [HotKeyType.Target] },
  },
  Hippogryph: {
    'Pick up Archer': { code: 'aco3', types: [HotKeyType.Target] },
  },
  'Hippogryph Rider': {
    'Dismount Archer': { code: 'adec', types: [HotKeyType.Basic] },
  },
  'Druid Of The Talon': {
    Cyclone: { code: 'acyc', types: [HotKeyType.Target] },
    'Faerie Fire': { code: 'afae', types: [HotKeyType.Target] },
    'Storm Crow Form': { code: 'arav', types: [HotKeyType.Basic] },
  },
  'Faerie Dragon': {
    'Mana Flare': { code: 'amfl', types: [HotKeyType.Basic] },
    'Phase Shift': { code: 'apsh', types: [HotKeyType.Basic] },
  },

  'Tree of Life': {
    Wisp: { code: 'ewsp', types: [HotKeyType.Basic] },
    'Nature’s Blessing': { code: 'renb', types: [HotKeyType.Basic] },
    Backpack: { code: 'repm', types: [HotKeyType.Basic] },
    'Upgrade to Tree of Ages': { code: 'etoa', types: [HotKeyType.Basic] },
    'Entangle Gold Mine': { code: 'aent', types: [HotKeyType.Target] },
    Uproot: { code: 'aro1', types: [HotKeyType.Basic] },
    Root: { code: 'aro1', types: [HotKeyType.Basic] },
    'Eat Tree': { code: 'aeat', types: [HotKeyType.Target] },
  },
  'Entangled Gold Mine': {
    'Load Wisp': { code: 'slo2', types: [HotKeyType.Basic] },
    'Unload All': { code: 'adri', types: [HotKeyType.Basic] },
  },
  'Ancient Of War': {
    Archer: { code: 'earc', types: [HotKeyType.Basic] },
    Huntress: { code: 'esen', types: [HotKeyType.Basic] },
    'Glaive Thrower': { code: 'ebal', types: [HotKeyType.Basic] },
    Marksmanship: { code: 'remk', types: [HotKeyType.Basic] },
    'Moon Glaive': { code: 'remg', types: [HotKeyType.Basic] },
    'Improved Bows': { code: 'reib', types: [HotKeyType.Basic] },
    Sentinel: { code: 'resc', types: [HotKeyType.Basic] },
    'Vorpal Blades': { code: 'repb', types: [HotKeyType.Basic] },
    Uproot: { code: 'aro1', types: [HotKeyType.Basic] },
    Root: { code: 'aro1', types: [HotKeyType.Basic] },
    'Eat Tree': { code: 'aeat', types: [HotKeyType.Target] },
  },
  'Hunter’s Hall': {
    'Strength of the Moon': { code: 'resm', types: [HotKeyType.Basic] },
    'Strength of the Wild': { code: 'resw', types: [HotKeyType.Basic] },
    'Moon Armor': { code: 'rema', types: [HotKeyType.Basic] },
    'Reinforced Hides': { code: 'rerh', types: [HotKeyType.Basic] },
    Ultravision: { code: 'reuv', types: [HotKeyType.Basic] },
    'Well Spring': { code: 'rews', types: [HotKeyType.Basic] },
  },
  'Moon Well': {
    'Replenish Mana and Life': { code: 'ambt', types: [HotKeyType.Basic] },
  },
  'Altar of Elders': {
    'Demon Hunter': { code: 'edem', types: [HotKeyType.Basic] },
    'Keeper of the Grove': { code: 'ekee', types: [HotKeyType.Basic] },
    'Priestess of the Moon': { code: 'emoo', types: [HotKeyType.Basic] },
    Warden: { code: 'ewar', types: [HotKeyType.Basic] },
  },
  'Ancient of Lore': {
    Dryad: { code: 'edry', types: [HotKeyType.Basic] },
    'Druid of the Claw': { code: 'edoc', types: [HotKeyType.Basic] },
    'Mountain Giant': { code: 'emtg', types: [HotKeyType.Basic] },
    'Abolish Magic': { code: 'resi', types: [HotKeyType.Basic] },
    'Druid of the Claw Adept Training': {
      code: 'redc',
      types: [HotKeyType.Basic],
    },
    'Druid of the Claw Master Training': {
      code: 'redc',
      types: [HotKeyType.Basic],
    },
    'Resistant Skin': { code: 'rers', types: [HotKeyType.Basic] },
    'Hardened Skin': { code: 'rehs', types: [HotKeyType.Basic] },
    'Mark of the Claw': { code: 'reeb', types: [HotKeyType.Basic] },
    Uproot: { code: 'aro1', types: [HotKeyType.Basic] },
    Root: { code: 'aro1', types: [HotKeyType.Basic] },
    'Eat Tree': { code: 'aeat', types: [HotKeyType.Target] },
  },
  'Ancient of Wind': {
    Hippogryph: { code: 'ehip', types: [HotKeyType.Basic] },
    'Druid of the Talon': { code: 'edot', types: [HotKeyType.Basic] },
    'Faerie Dragon': { code: 'efdr', types: [HotKeyType.Basic] },
    'Druid of the Talon Adept Training': {
      code: 'redt',
      types: [HotKeyType.Basic],
    },
    'Druid of the Talon Master Training': {
      code: 'redt',
      types: [HotKeyType.Basic],
    },
    'Mark of the Talon': { code: 'reec', types: [HotKeyType.Basic] },
    Uproot: { code: 'aro1', types: [HotKeyType.Basic] },
    Root: { code: 'aro1', types: [HotKeyType.Basic] },
    'Eat Tree': { code: 'aeat', types: [HotKeyType.Target] },
  },
  'Chimaera Roost': {
    Chimaera: { code: 'echm', types: [HotKeyType.Basic] },
    'Corrosive Breath': { code: 'recb', types: [HotKeyType.Basic] },
  },
  'Ancient of Wonders': {
    Moonstone: { code: 'moon', types: [HotKeyType.Basic] },
    'Lesser Clarity Potion': { code: 'plcl', types: [HotKeyType.Basic] },
    'Dust of Appearance': { code: 'dust', types: [HotKeyType.Basic] },
    'Potion of Healing': { code: 'phea', types: [HotKeyType.Basic] },
    'Potion of Mana': { code: 'pman', types: [HotKeyType.Basic] },
    'Scroll of Town Portal': { code: 'stwp', types: [HotKeyType.Basic] },
    'Staff of Preservation': { code: 'spre', types: [HotKeyType.Basic] },
    'Orb of Venom': { code: 'oven', types: [HotKeyType.Basic] },
    'Anti-magic Potion': { code: 'pams', types: [HotKeyType.Basic] },
    Uproot: { code: 'aro1', types: [HotKeyType.Basic] },
    Root: { code: 'aro1', types: [HotKeyType.Basic] },
    'Eat Tree': { code: 'aeat', types: [HotKeyType.Target] },
  },
};

export const actions = {
  ...Basic,
  ...Inventory,
  ...NightElf,
};

export const night_elf_actions = {
  ...Inventory,
  ...NightElf,
};

export const getCodeFromAction = (name: string, action: string) => {
  const a = action.replace('HeroAbilitiesTrain', '');
  const result =
    actions?.[name]?.[a]?.code ?? actions?.[a]?.code ?? actions?.[a] ?? a;
  return result;
};

export const createActions = (action: string, type: HotKeyType) => {
  switch (type) {
    case HotKeyType.Basic:
      return [action];
    case HotKeyType.Use:
      return [action, action];
    case HotKeyType.Target:
      return [action, Basic.TargetDummy];
    case HotKeyType.Dodge:
      return [Basic.MissileDodge, action];
    case HotKeyType.Train:
      return ['HeroAbilities', `HeroAbilitiesTrain${action}`];
    case HotKeyType.NightElfBuild:
      return ['NightElfBuild', action];
  }
};

export const createPuzzles = (name: string) => {
  return _flatten(
    _map(actions?.[name], (data, action) => {
      return data.types.map((t: HotKeyType) => ({
        name,
        actions: createActions(action, t),
      }));
    }),
  );
};

export const actionToName = (action: string) => {
  switch (action) {
    case 'NightElfBuild':
      return 'Create';
    case Basic.TargetDummy:
      return 'on Target';
    case Basic.MissileDodge:
      return 'Dodge incoming projectile with ';
    case 'HeroAbilities':
      return 'Train';
    default:
      return `${action.replace('HeroAbilitiesTrain', '')}`;
  }
};
