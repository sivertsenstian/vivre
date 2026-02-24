import _map from 'lodash/map';
import _flatten from 'lodash/flatten';
import _merge from 'lodash/merge';

export enum HotKeyType {
  BasicBuild = 'BasicBuild',
  BasicAbility = 'BasicAbility',
  BasicBuy = 'BasicBuy',
  BasicUpgrade = 'BasicUpgrade',
  BasicItem = 'BasicItem',
  BasicSelect = 'BasicSelect',

  Target = 'Target',
  MultiTarget = 'MultiTarget',
  Use = 'Use',
  Dodge = 'Dodge',
  Train = 'Train',
  NightElfBuild = 'NightElfBuild ',
  UndeadBuild = 'UndeadBuild ',
  OrcBuild = 'OrcBuild ',
  HumanBuild = 'HumanBuild ',
}

export const Basic: any = {
  HeroAbilities: { code: 'cmdselectskill', types: [HotKeyType.BasicAbility] },
  NightElfBuild: { code: 'cmdbuildnightelf', types: [HotKeyType.BasicBuild] },
  UndeadBuild: { code: 'cmdbuildundead', types: [HotKeyType.BasicBuild] },
  OrcBuild: { code: 'cmdbuildorc', types: [HotKeyType.BasicBuild] },
  HumanBuild: { code: 'cmdbuildhuman', types: [HotKeyType.BasicBuild] },
  TargetDummy: 'TARGETDUMMY',
  MissileDodge: 'MISSILEDODGE',
  Miss: 'MISS',
};

const BasicInventory: any = {
  Item1: {
    'Scroll Of Town Portal': {
      code: 'itm1',
      types: [HotKeyType.Target, HotKeyType.Use],
    },
  },
  Item2: {
    'Potion of Lesser Invulnerability': {
      code: 'itm2',
      types: [HotKeyType.BasicItem, HotKeyType.Dodge],
    },
    'Potion of Greater Invulnerability': {
      code: 'itm2',
      types: [HotKeyType.BasicItem, HotKeyType.Dodge],
    },
    'Potion of Healing': {
      code: 'itm2',
      types: [HotKeyType.BasicItem],
    },
    'Potion of Greater Healing': {
      code: 'itm2',
      types: [HotKeyType.BasicItem],
    },
    Healthstone: {
      code: 'itm2',
      types: [HotKeyType.BasicItem],
    },
    'Staff of Teleportation': { code: 'itm2', types: [HotKeyType.Target] },
  },
  Item3: {
    'Potion of Mana': {
      code: 'itm3',
      types: [HotKeyType.BasicItem],
    },
    'Potion of Greater Mana': {
      code: 'itm3',
      types: [HotKeyType.BasicItem],
    },
    'Dust Of Appearance': {
      code: 'itm3',
      types: [HotKeyType.BasicItem],
    },
  },
  Item4: {
    'Potion of Lesser Invulnerability': {
      code: 'itm4',
      types: [HotKeyType.BasicItem, HotKeyType.Dodge],
    },
    'Scroll Of Healing': {
      code: 'itm4',
      types: [HotKeyType.BasicItem],
    },
  },
};

export const NightElfInventory: any = {
  Item2: {
    'Staff Of Preservation': { code: 'itm2', types: [HotKeyType.Target] },
  },
};
export const NightElf: any = {
  'Demon Hunter': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    'Mana Burn': { code: 'aemb', types: [HotKeyType.Target, HotKeyType.Train] },
    Immolation: {
      code: 'aeim',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    Evasion: { code: 'aeev', types: [HotKeyType.Train] },
    Metamorphosis: {
      code: 'aeme',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  'Keeper Of The Grove': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    'Entangling Roots': {
      code: 'aeer',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Force Of Nature': {
      code: 'aefn',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Thorns Aura': { code: 'aeah', types: [HotKeyType.Train] },
    Tranquility: {
      code: 'aetq',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  'Priestess of the Moon': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    Scout: { code: 'aest', types: [HotKeyType.BasicAbility, HotKeyType.Train] },
    'Searing Arrows': { code: 'ahfa', types: [HotKeyType.Train] },
    'Trueshot Aura': { code: 'aear', types: [HotKeyType.Train] },
    Starfall: { code: 'aesf', types: [HotKeyType.BasicAbility] },
    Shadowmeld: { code: 'ashm', types: [HotKeyType.BasicAbility] },
  },
  Warden: {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    'Fan of Knives': {
      code: 'aefk',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    Blink: { code: 'aebl', types: [HotKeyType.Target, HotKeyType.Train] },
    'Shadow Strike': {
      code: 'aesh',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    Vengeance: {
      code: 'aesv',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    Shadowmeld: { code: 'ashm', types: [HotKeyType.BasicAbility] },
  },

  Wisp: {
    Renew: { code: 'aren', types: [HotKeyType.Target] },
    Detonate: {
      code: 'adtn',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
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
    'Mount Hippogryph': { code: 'aco2', types: [HotKeyType.BasicAbility] },
    Shadowmeld: { code: 'ashm', types: [HotKeyType.BasicAbility] },
  },
  Huntress: {
    Sentinel: { code: 'aesn', types: [HotKeyType.Target] },
    Shadowmeld: { code: 'ashm', types: [HotKeyType.BasicAbility] },
  },
  'Glaive Thrower': {
    'Attack Ground': { code: 'cmdattackground', types: [HotKeyType.Target] },
  },
  Dryad: {
    'Abolish Magic': {
      code: 'aadm',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
  },
  'Druid Of The Claw': {
    Roar: { code: 'aroa', types: [HotKeyType.BasicAbility] },
    Rejuvenation: {
      code: 'arej',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
    'Bear Form': { code: 'abrf', types: [HotKeyType.BasicAbility] },
  },
  'Mountain Giant': {
    Taunt: { code: 'atau', types: [HotKeyType.BasicAbility] },
    'War Club': { code: 'agra', types: [HotKeyType.Target] },
  },
  Hippogryph: {
    'Pick up Archer': { code: 'aco3', types: [HotKeyType.BasicAbility] },
  },
  'Hippogryph Rider': {
    'Dismount Archer': { code: 'adec', types: [HotKeyType.BasicAbility] },
  },
  'Druid Of The Talon': {
    Cyclone: {
      code: 'acyc',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
    'Faerie Fire': {
      code: 'afae',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
    'Storm Crow Form': { code: 'arav', types: [HotKeyType.BasicAbility] },
  },
  'Faerie Dragon': {
    'Mana Flare': { code: 'amfl', types: [HotKeyType.BasicAbility] },
    'Phase Shift': { code: 'apsh', types: [HotKeyType.BasicAbility] },
  },

  'Tree of Life': {
    Wisp: { code: 'ewsp', types: [HotKeyType.BasicBuild] },
    'Nature’s Blessing': { code: 'renb', types: [HotKeyType.BasicUpgrade] },
    Backpack: { code: 'repm', types: [HotKeyType.BasicUpgrade] },
    'Tree of Ages': { code: 'etoa', types: [HotKeyType.BasicUpgrade] },
    'Entangled Gold Mine': { code: 'aent', types: [HotKeyType.Target] },
    Uproot: { code: 'aro1', types: [HotKeyType.BasicAbility] },
    Root: { code: 'aro1', types: [HotKeyType.BasicAbility] },
    'Eat Tree': { code: 'aeat', types: [HotKeyType.Target] },
  },
  'Tree of Ages': {
    'Tree of Eternity': { code: 'etoe', types: [HotKeyType.BasicUpgrade] },
  },
  'Entangled Gold Mine': {
    'Load Wisp': { code: 'slo2', types: [HotKeyType.BasicAbility] },
    'Unload All': { code: 'adri', types: [HotKeyType.BasicAbility] },
  },
  'Ancient Of War': {
    Archer: { code: 'earc', types: [HotKeyType.BasicBuild] },
    Huntress: { code: 'esen', types: [HotKeyType.BasicBuild] },
    'Glaive Thrower': { code: 'ebal', types: [HotKeyType.BasicBuild] },
    Marksmanship: { code: 'remk', types: [HotKeyType.BasicUpgrade] },
    'Moon Glaive': { code: 'remg', types: [HotKeyType.BasicUpgrade] },
    'Improved Bows': { code: 'reib', types: [HotKeyType.BasicUpgrade] },
    Sentinel: { code: 'resc', types: [HotKeyType.BasicUpgrade] },
    'Vorpal Blades': { code: 'repb', types: [HotKeyType.BasicUpgrade] },
    Uproot: { code: 'aro1', types: [HotKeyType.BasicAbility] },
    Root: { code: 'aro1', types: [HotKeyType.BasicAbility] },
    'Eat Tree': { code: 'aeat', types: [HotKeyType.BasicAbility] },
  },
  'Hunter’s Hall': {
    'Strength of the Moon': { code: 'resm', types: [HotKeyType.BasicUpgrade] },
    'Improved Strength of the Moon': {
      code: 'resm',
      types: [HotKeyType.BasicUpgrade],
    },
    'Advanced Strength of the Moon': {
      code: 'resm',
      types: [HotKeyType.BasicUpgrade],
    },
    'Strength of the Wild': { code: 'resw', types: [HotKeyType.BasicUpgrade] },
    'Improved Strength of the Wild': {
      code: 'resw',
      types: [HotKeyType.BasicUpgrade],
    },
    'Advanced Strength of the Wild': {
      code: 'resw',
      types: [HotKeyType.BasicUpgrade],
    },
    'Moon Armor': { code: 'rema', types: [HotKeyType.BasicUpgrade] },
    'Improved Moon Armor': { code: 'rema', types: [HotKeyType.BasicUpgrade] },
    'Advanced Moon Armor': { code: 'rema', types: [HotKeyType.BasicUpgrade] },
    'Reinforced Hides': { code: 'rerh', types: [HotKeyType.BasicUpgrade] },
    'Improved Reinforced Hides': {
      code: 'rerh',
      types: [HotKeyType.BasicUpgrade],
    },
    'Advanced Reinforced Hides': {
      code: 'rerh',
      types: [HotKeyType.BasicUpgrade],
    },
    Ultravision: { code: 'reuv', types: [HotKeyType.BasicUpgrade] },
    'Well Spring': { code: 'rews', types: [HotKeyType.BasicUpgrade] },
  },
  'Moon Well': {
    'Replenish Mana and Life': {
      code: 'ambt',
      types: [HotKeyType.BasicAbility],
    },
  },
  'Altar of Elders': {
    'Demon Hunter': { code: 'edem', types: [HotKeyType.BasicBuild] },
    'Keeper of the Grove': { code: 'ekee', types: [HotKeyType.BasicBuild] },
    'Priestess of the Moon': { code: 'emoo', types: [HotKeyType.BasicBuild] },
    Warden: { code: 'ewar', types: [HotKeyType.BasicBuild] },
  },
  'Ancient of Lore': {
    Dryad: { code: 'edry', types: [HotKeyType.BasicBuild] },
    'Druid of the Claw': { code: 'edoc', types: [HotKeyType.BasicBuild] },
    'Mountain Giant': { code: 'emtg', types: [HotKeyType.BasicBuild] },
    'Abolish Magic': { code: 'resi', types: [HotKeyType.BasicUpgrade] },
    'Druid of the Claw Adept Training': {
      code: 'redc',
      types: [HotKeyType.BasicUpgrade],
    },
    'Druid of the Claw Master Training': {
      code: 'redc',
      types: [HotKeyType.BasicUpgrade],
    },
    'Resistant Skin': { code: 'rers', types: [HotKeyType.BasicUpgrade] },
    'Hardened Skin': { code: 'rehs', types: [HotKeyType.BasicUpgrade] },
    'Mark of the Claw': { code: 'reeb', types: [HotKeyType.BasicUpgrade] },
    Uproot: { code: 'aro1', types: [HotKeyType.BasicAbility] },
    Root: { code: 'aro1', types: [HotKeyType.BasicAbility] },
    'Eat Tree': { code: 'aeat', types: [HotKeyType.Target] },
  },
  'Ancient of Wind': {
    Hippogryph: { code: 'ehip', types: [HotKeyType.BasicBuild] },
    'Druid of the Talon': { code: 'edot', types: [HotKeyType.BasicBuild] },
    'Faerie Dragon': { code: 'efdr', types: [HotKeyType.BasicBuild] },
    'Druid of the Talon Adept Training': {
      code: 'redt',
      types: [HotKeyType.BasicUpgrade],
    },
    'Druid of the Talon Master Training': {
      code: 'redt',
      types: [HotKeyType.BasicUpgrade],
    },
    'Mark of the Talon': { code: 'reec', types: [HotKeyType.BasicUpgrade] },
    Uproot: { code: 'aro1', types: [HotKeyType.BasicAbility] },
    Root: { code: 'aro1', types: [HotKeyType.BasicAbility] },
    'Eat Tree': { code: 'aeat', types: [HotKeyType.Target] },
  },
  'Chimaera Roost': {
    Chimaera: { code: 'echm', types: [HotKeyType.BasicBuild] },
    'Corrosive Breath': { code: 'recb', types: [HotKeyType.BasicUpgrade] },
  },
  'Ancient of Wonders': {
    Moonstone: { code: 'moon', types: [HotKeyType.BasicBuy] },
    'Lesser Clarity Potion': { code: 'plcl', types: [HotKeyType.BasicBuy] },
    'Dust of Appearance': { code: 'dust', types: [HotKeyType.BasicBuy] },
    'Potion of Healing': { code: 'phea', types: [HotKeyType.BasicBuy] },
    'Potion of Mana': { code: 'pman', types: [HotKeyType.BasicBuy] },
    'Scroll of Town Portal': { code: 'stwp', types: [HotKeyType.BasicBuy] },
    'Staff of Preservation': { code: 'spre', types: [HotKeyType.BasicBuy] },
    'Orb of Venom': { code: 'oven', types: [HotKeyType.BasicBuy] },
    'Anti magic Potion': { code: 'pams', types: [HotKeyType.BasicBuy] },
    Uproot: { code: 'aro1', types: [HotKeyType.BasicAbility] },
    Root: { code: 'aro1', types: [HotKeyType.BasicAbility] },
    'Eat Tree': { code: 'aeat', types: [HotKeyType.Target] },
  },
};

export const UndeadInventory: any = {
  Item2: {
    'Rod Of Necromancy': { code: 'itm2', types: [HotKeyType.BasicItem] },
  },
  Item3: {
    'Ritual Dagger': { code: 'itm3', types: [HotKeyType.Target] },
  },
  Item4: {
    'Sacrificial Skull': { code: 'itm4', types: [HotKeyType.Target] },
    'Wand of Negation': { code: 'itm4', types: [HotKeyType.Target] },
  },
};

export const Undead: any = {
  'Death Knight': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    'Death Coil': {
      code: 'audc',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Death Pact': {
      code: 'audp',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Unholy Aura': { code: 'auau', types: [HotKeyType.Train] },
    'Animate Dead': {
      code: 'auan',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  Dreadlord: {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    'Vampiric Aura': {
      code: 'auav',
      types: [HotKeyType.Train],
    },
    Sleep: {
      code: 'ausl',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Carrion Swarm': {
      code: 'aucs',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    Infernal: {
      code: 'auin',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
  },
  Lich: {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    'Frost Nova': {
      code: 'aufn',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Frost Armor': {
      code: 'aufu',
      types: [HotKeyType.Target, HotKeyType.MultiTarget, HotKeyType.Train],
    },
    'Dark Ritual': {
      code: 'audr',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Death and Decay': {
      code: 'audd',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
  },
  'Crypt Lord': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    Impale: {
      code: 'auim',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Spiked Carapace': {
      code: 'auts',
      types: [HotKeyType.Train],
    },
    'Carrion Beetles': {
      code: 'aucb',
      types: [HotKeyType.Train],
    },
    'Locust Swarm': {
      code: 'auls',
      types: [HotKeyType.Train],
    },
  },
  Acolyte: {
    'Unsummon Building': { code: 'auns', types: [HotKeyType.Target] },
    Sacrifice: { code: 'alam', types: [HotKeyType.Target] },
    Repair: { code: 'arst', types: [HotKeyType.Target] },
    Necropolis: { code: 'unpl', types: [HotKeyType.UndeadBuild] },
    Crypt: { code: 'usep', types: [HotKeyType.UndeadBuild] },
    'Haunted Gold Mine': { code: 'ugol', types: [HotKeyType.UndeadBuild] },
    Graveyard: { code: 'ugrv', types: [HotKeyType.UndeadBuild] },
    Ziggurat: { code: 'uzig', types: [HotKeyType.UndeadBuild] },
    'Altar of Darkness': { code: 'uaod', types: [HotKeyType.UndeadBuild] },
    'Temple of the Damned': { code: 'utod', types: [HotKeyType.UndeadBuild] },
    Slaughterhouse: { code: 'uslh', types: [HotKeyType.UndeadBuild] },
    'Sacrificial Pit': { code: 'usap', types: [HotKeyType.UndeadBuild] },
    Boneyard: { code: 'ubon', types: [HotKeyType.UndeadBuild] },
    'Tomb of Relics': { code: 'utom', types: [HotKeyType.UndeadBuild] },
  },
  Ghoul: {
    Cannibalize: { code: 'acan', types: [HotKeyType.BasicAbility] },
    Gather: { code: 'ahrl', types: [HotKeyType.Target] },
  },
  'Crypt Fiend': {
    Unburrow: { code: 'abur', types: [HotKeyType.BasicAbility] },
    Burrow: { code: 'abur', types: [HotKeyType.BasicAbility] },
    Web: { code: 'aweb', types: [HotKeyType.Target, HotKeyType.MultiTarget] },
  },
  Gargoyle: {
    'Stone Form': { code: 'astn', types: [HotKeyType.BasicAbility] },
  },
  Abomination: {
    Cannibalize: { code: 'acan', types: [HotKeyType.BasicAbility] },
  },
  'Meat Wagon': {
    'Attack Ground': { code: 'cmdattackground', types: [HotKeyType.Target] },
    'Load Corpse': { code: 'amel', types: [HotKeyType.Target] },
    'Drop All Corpses': { code: 'amed', types: [HotKeyType.BasicAbility] },
  },
  Necromancer: {
    'Raise Dead': { code: 'arai', types: [HotKeyType.BasicAbility] },
    'Unholy Frenzy': {
      code: 'auhf',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
    Cripple: {
      code: 'acri',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
  },
  Banshee: {
    'Anti magic Shell': {
      code: 'aam2',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
    Curse: { code: 'acrs', types: [HotKeyType.Target, HotKeyType.MultiTarget] },
    Possession: {
      code: 'aps2',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
  },
  'Obsidian Statue': {
    'Essence Of Blight': { code: 'arpl', types: [HotKeyType.BasicAbility] },
    'Spirit Touch': { code: 'arpm', types: [HotKeyType.BasicAbility] },
    Destroyer: { code: 'ubsp', types: [HotKeyType.BasicAbility] },
  },
  Destroyer: {
    'Devour Magic': {
      code: 'advm',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
    'Absorb Mana': { code: 'aabs', types: [HotKeyType.Target] },
  },
  Necropolis: {
    Acolyte: { code: 'uaco', types: [HotKeyType.BasicBuild] },
    Backpack: { code: 'rupm', types: [HotKeyType.BasicUpgrade] },
    'Halls Of The Dead': { code: 'unp1', types: [HotKeyType.BasicUpgrade] },
  },
  'Halls Of The Dead': {
    'Black Citadel': { code: 'unp2', types: [HotKeyType.BasicUpgrade] },
  },
  Crypt: {
    Ghoul: { code: 'ugho', types: [HotKeyType.BasicBuild] },
    'Crypt Fiend': { code: 'ucry', types: [HotKeyType.BasicBuild] },
    Gargoyle: { code: 'ugar', types: [HotKeyType.BasicBuild] },
    Cannibalize: { code: 'ruac', types: [HotKeyType.BasicUpgrade] },
    Web: { code: 'ruwb', types: [HotKeyType.BasicUpgrade] },
    'Ghoul Frenzy': { code: 'rugf', types: [HotKeyType.BasicUpgrade] },
    'Stone Form': { code: 'rusf', types: [HotKeyType.BasicUpgrade] },
    Burrow: { code: 'rubu', types: [HotKeyType.BasicUpgrade] },
  },
  Graveyard: {
    'Unholy Strength': { code: 'rume', types: [HotKeyType.BasicUpgrade] },
    'Improved Unholy Strength': {
      code: 'rume',
      types: [HotKeyType.BasicUpgrade],
    },
    'Advanced Unholy Strength': {
      code: 'rume',
      types: [HotKeyType.BasicUpgrade],
    },
    'Unholy Armor': { code: 'ruar', types: [HotKeyType.BasicUpgrade] },
    'Improved Unholy Armor': { code: 'ruar', types: [HotKeyType.BasicUpgrade] },
    'Advanced Unholy Armor': { code: 'ruar', types: [HotKeyType.BasicUpgrade] },
    'Creature Attack': { code: 'rura', types: [HotKeyType.BasicUpgrade] },
    'Improved Creature Attack': {
      code: 'rura',
      types: [HotKeyType.BasicUpgrade],
    },
    'Advanced Creature Attack': {
      code: 'rura',
      types: [HotKeyType.BasicUpgrade],
    },
    'Creature Carapace': { code: 'rucr', types: [HotKeyType.BasicUpgrade] },
    'Improved Creature Carapace': {
      code: 'rucr',
      types: [HotKeyType.BasicUpgrade],
    },
    'Advanced Creature Carapace': {
      code: 'rucr',
      types: [HotKeyType.BasicUpgrade],
    },
  },
  Ziggurat: {
    'Spirit Tower': { code: 'uzg1', types: [HotKeyType.BasicUpgrade] },
    'Nerubian Tower': { code: 'uzg2', types: [HotKeyType.BasicUpgrade] },
  },
  'Altar of Darkness': {
    'Death Knight': { code: 'udea', types: [HotKeyType.BasicBuild] },
    Lich: { code: 'ulic', types: [HotKeyType.BasicBuild] },
    Dreadlord: { code: 'udre', types: [HotKeyType.BasicBuild] },
    'Crypt Lord': { code: 'ucrl', types: [HotKeyType.BasicBuild] },
  },
  'Temple of the Damned': {
    Necromancer: { code: 'unec', types: [HotKeyType.BasicBuild] },
    Banshee: { code: 'uban', types: [HotKeyType.BasicBuild] },
    'Necromancer Adept Training': {
      code: 'rune',
      types: [HotKeyType.BasicUpgrade],
    },
    'Necromancer Master Training': {
      code: 'rune',
      types: [HotKeyType.BasicUpgrade],
    },
    'Banshee Adept Training': {
      code: 'ruba',
      types: [HotKeyType.BasicUpgrade],
    },
    'Banshee Master Training': {
      code: 'ruba',
      types: [HotKeyType.BasicUpgrade],
    },
    'Skeletal Mastery': { code: 'rusm', types: [HotKeyType.BasicUpgrade] },
  },
  Slaughterhouse: {
    'Meat Wagon': { code: 'umtw', types: [HotKeyType.BasicBuild] },
    Abomination: { code: 'uabo', types: [HotKeyType.BasicBuild] },
    'Obsidian Statue': { code: 'uobs', types: [HotKeyType.BasicBuild] },
    'Disease Cloud': { code: 'rupc', types: [HotKeyType.BasicUpgrade] },
    'Destroyer Form': { code: 'rusp', types: [HotKeyType.BasicUpgrade] },
    'Exhume Corpses': { code: 'ruex', types: [HotKeyType.BasicUpgrade] },
  },
  'Sacrificial Pit': {
    Sacrifice: { code: 'asac', types: [HotKeyType.Target] },
  },
  Boneyard: {
    'Frost Wyrm': { code: 'ufro', types: [HotKeyType.BasicBuild] },
    'Freezing Breath': { code: 'rufb', types: [HotKeyType.BasicUpgrade] },
  },
  'Tomb of Relics': {
    'Rod of Necromancy': { code: 'rnec', types: [HotKeyType.BasicBuy] },
    'Ritual Dagger': { code: 'ritd', types: [HotKeyType.BasicBuy] },
    'Sacrificial Skull': { code: 'skul', types: [HotKeyType.BasicBuy] },
    'Dust of Appearance': { code: 'dust', types: [HotKeyType.BasicBuy] },
    'Potion of Healing': { code: 'phea', types: [HotKeyType.BasicBuy] },
    'Potion of Mana': { code: 'pman', types: [HotKeyType.BasicBuy] },
    'Scroll of Town Portal': { code: 'stwp', types: [HotKeyType.BasicBuy] },
    'Orb of Corruption': { code: 'ocor', types: [HotKeyType.BasicBuy] },
    'Wand of Negation': { code: 'wneg', types: [HotKeyType.BasicBuy] },
  },
};

export const OrcInventory: any = {
  Item2: {
    'Healing Salve': {
      code: 'itm2',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
  },
  Item4: {
    'Scroll Of Speed': { code: 'itm4', types: [HotKeyType.BasicAbility] },
  },
};

export const Orc: any = {
  Blademaster: {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    'Wind Walk': {
      code: 'aowk',
      types: [HotKeyType.BasicAbility, HotKeyType.Dodge, HotKeyType.Train],
    },
    'Critical Strike': {
      code: 'aocr',
      types: [HotKeyType.Train],
    },
    'Mirror Image': {
      code: 'aomi',
      types: [HotKeyType.BasicAbility, HotKeyType.Dodge, HotKeyType.Train],
    },
    Bladestorm: {
      code: 'aoww',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  'Far Seer': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    'Far Sight': {
      code: 'aofs',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Feral Spirit': {
      code: 'aosf',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    'Chain Lightning': {
      code: 'aocl',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    Earthquake: {
      code: 'aoeq',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
  },
  'Tauren Chieftain': {
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    Shockwave: {
      code: 'aosh',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Endurance Aura': {
      code: 'aoae',
      types: [HotKeyType.Train],
    },
    'War Stomp': {
      code: 'aows',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    Reincarnation: {
      code: 'aore',
      types: [HotKeyType.Train],
    },
  },
  'Shadow Hunter': {
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    Hex: {
      code: 'aohx',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Healing Wave': {
      code: 'aohw',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Serpent Ward': {
      code: 'aosw',
      types: [HotKeyType.Target, HotKeyType.MultiTarget, HotKeyType.Train],
    },
    'Big Bad Voodoo': {
      code: 'aovd',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },

  Peon: {
    Repair: { code: 'arep', types: [HotKeyType.Target] },
    'Great Hall': { code: 'ogre', types: [HotKeyType.OrcBuild] },
    Barracks: { code: 'obar', types: [HotKeyType.OrcBuild] },
    'War Mill': { code: 'ofor', types: [HotKeyType.OrcBuild] },
    'Watch Tower': { code: 'owtw', types: [HotKeyType.OrcBuild] },
    'Orc Burrow': { code: 'otrb', types: [HotKeyType.OrcBuild] },
    'Altar of Storms': { code: 'oalt', types: [HotKeyType.OrcBuild] },
    'Spirit Lodge': { code: 'osld', types: [HotKeyType.OrcBuild] },
    Beastiary: { code: 'obea', types: [HotKeyType.OrcBuild] },
    'Tauren Totem': { code: 'otto', types: [HotKeyType.OrcBuild] },
    'Voodoo Lounge': { code: 'ovln', types: [HotKeyType.OrcBuild] },
  },
  'Troll Berserker': {
    Berserk: { code: 'absk', types: [HotKeyType.BasicAbility] },
  },
  Demolisher: {
    'Attack Ground': { code: 'cmdattackground', types: [HotKeyType.Target] },
  },
  Shaman: {
    Purge: { code: 'apg2', types: [HotKeyType.Target, HotKeyType.MultiTarget] },
    'Lightning Shield': {
      code: 'alsh',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
    Bloodlust: {
      code: 'ablo',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
  },
  'Witch Doctor': {
    'Sentry Ward': { code: 'aeye', types: [HotKeyType.Target] },
    'Stasis Trap': {
      code: 'asta',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
    'Healing Ward': {
      code: 'ahwd',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
  },
  'Spirit Walker': {
    'Corporeal Form': { code: 'acpf', types: [HotKeyType.BasicAbility] },
    'Ethereal Form': { code: 'acpf', types: [HotKeyType.BasicAbility] },
    'Spirit Link': {
      code: 'aspl',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
    Disenchant: {
      code: 'adcn',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
    'Ancestral Spirit': { code: 'aast', types: [HotKeyType.BasicAbility] },
  },
  Raider: {
    Ensnare: {
      code: 'aens',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
  },
  'Kodo Beast': {
    Devour: {
      code: 'adev',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
  },
  'Troll Batrider': {
    'Unstable Concoction': {
      code: 'auco',
      types: [HotKeyType.Target, HotKeyType.MultiTarget],
    },
  },
  'Great Hall': {
    Peon: { code: 'opeo', types: [HotKeyType.BasicBuild] },
    Pillage: { code: 'ropg', types: [HotKeyType.BasicUpgrade] },
    Backpack: { code: 'ropm', types: [HotKeyType.BasicUpgrade] },
    Stronghold: { code: 'ostr', types: [HotKeyType.BasicUpgrade] },
  },
  Stronghold: {
    Fortress: { code: 'ofrt', types: [HotKeyType.BasicUpgrade] },
  },
  Barracks: {
    Grunt: { code: 'ogru', types: [HotKeyType.BasicBuild] },
    'Troll Headhunter': { code: 'ohun', types: [HotKeyType.BasicBuild] },
    'Troll Berserker': { code: 'otbk', types: [HotKeyType.BasicBuild] },
    Demolisher: { code: 'ocat', types: [HotKeyType.BasicBuild] },
    'Berserker Strength': { code: 'robs', types: [HotKeyType.BasicUpgrade] },
    'Troll Regeneration': { code: 'rotr', types: [HotKeyType.BasicUpgrade] },
    'Berserker Upgrade': { code: 'robk', types: [HotKeyType.BasicUpgrade] },
    'Burning Oil': { code: 'robf', types: [HotKeyType.BasicUpgrade] },
  },
  'War Mill': {
    'Steel Melee Weapons': { code: 'rome', types: [HotKeyType.BasicUpgrade] },
    'Thorium Melee Weapons': { code: 'rome', types: [HotKeyType.BasicUpgrade] },
    'Arcanite Melee Weapons': {
      code: 'rome',
      types: [HotKeyType.BasicUpgrade],
    },
    'Steel Armor': { code: 'roar', types: [HotKeyType.BasicUpgrade] },
    'Thorium Armor': { code: 'roar', types: [HotKeyType.BasicUpgrade] },
    'Arcanite Armor': { code: 'roar', types: [HotKeyType.BasicUpgrade] },
    'Steel Ranged Weapons': {
      code: 'rora',
      types: [HotKeyType.BasicUpgrade],
    },
    'Thorium Ranged Weapons': {
      code: 'rora',
      types: [HotKeyType.BasicUpgrade],
    },
    'Arcanite Ranged Weapons': {
      code: 'rora',
      types: [HotKeyType.BasicUpgrade],
    },
    'Spiked Barricades': { code: 'rosp', types: [HotKeyType.BasicUpgrade] },
    'Improved Spiked Barricades': {
      code: 'rosp',
      types: [HotKeyType.BasicUpgrade],
    },
    'Reinforced Defenses': { code: 'rorb', types: [HotKeyType.BasicUpgrade] },
  },
  'Orc Burrow': {
    'Battle Stations': { code: 'abtl', types: [HotKeyType.BasicAbility] },
    'Stand Down': { code: 'astd', types: [HotKeyType.BasicAbility] },
  },
  'Altar of Storms': {
    Blademaster: { code: 'obla', types: [HotKeyType.BasicBuild] },
    'Far Seer': { code: 'ofar', types: [HotKeyType.BasicBuild] },
    'Tauren Chieftain': { code: 'otch', types: [HotKeyType.BasicBuild] },
    'Shadow Hunter': { code: 'oshd', types: [HotKeyType.BasicBuild] },
  },
  'Spirit Lodge': {
    Shaman: { code: 'oshm', types: [HotKeyType.BasicBuild] },
    'Witch Doctor': { code: 'odoc', types: [HotKeyType.BasicBuild] },
    'Shaman Adept Training': { code: 'rost', types: [HotKeyType.BasicUpgrade] },
    'Shaman Master Training': {
      code: 'rost',
      types: [HotKeyType.BasicUpgrade],
    },
    'Witch Doctor Adept Training': {
      code: 'rowd',
      types: [HotKeyType.BasicUpgrade],
    },
    'Witch Doctor Master Training': {
      code: 'rowd',
      types: [HotKeyType.BasicUpgrade],
    },
  },
  Beastiary: {
    Raider: { code: 'orai', types: [HotKeyType.BasicBuild] },
    'Kodo Beast': { code: 'okod', types: [HotKeyType.BasicBuild] },
    'Wind Rider': { code: 'owyv', types: [HotKeyType.BasicBuild] },
    'Troll Batrider': { code: 'otbr', types: [HotKeyType.BasicBuild] },
    Ensnare: { code: 'roen', types: [HotKeyType.BasicUpgrade] },
    'Envenomed Spear': { code: 'rovs', types: [HotKeyType.BasicUpgrade] },
    'War Drums': { code: 'rwdm', types: [HotKeyType.BasicUpgrade] },
    'Liquid Fire': { code: 'rolf', types: [HotKeyType.BasicUpgrade] },
  },
  'Tauren Totem': {
    Tauren: { code: 'otau', types: [HotKeyType.BasicBuild] },
    'Spirit Walker': { code: 'ospm', types: [HotKeyType.BasicBuild] },
    Pulverize: { code: 'rows', types: [HotKeyType.BasicUpgrade] },
    'Spirit Walker Adept Training': {
      code: 'rowt',
      types: [HotKeyType.BasicUpgrade],
    },
    'Spirit Walker Master Training': {
      code: 'rowt',
      types: [HotKeyType.BasicUpgrade],
    },
  },
  'Voodoo Lounge': {
    'Scroll of Speed': { code: 'shas', types: [HotKeyType.BasicBuy] },
    'Healing Salve': { code: 'hslv', types: [HotKeyType.BasicBuy] },
    'Lesser Clarity Potion': { code: 'plcl', types: [HotKeyType.BasicBuy] },
    'Potion of Healing': { code: 'phea', types: [HotKeyType.BasicBuy] },
    'Potion of Mana': { code: 'pman', types: [HotKeyType.BasicBuy] },
    'Scroll of Town Portal': { code: 'stwp', types: [HotKeyType.BasicBuy] },
    'Tiny Great Hall': { code: 'tgrh', types: [HotKeyType.BasicBuy] },
    'Orb of Lightning': { code: 'oli2', types: [HotKeyType.BasicBuy] },
  },
};

export const HumanInventory: any = {
  Item2: {
    'Staff Of Sanctuary': {
      code: 'itm2',
      types: [HotKeyType.Target],
    },
    'Scroll Of Regeneration': {
      code: 'itm2',
      types: [HotKeyType.BasicAbility],
    },
    'Ivory Tower': {
      code: 'itm2',
      types: [HotKeyType.Target],
    },
  },
};

export const Human: any = {
  Paladin: {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    'Holy Light': {
      code: 'ahhb',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    'Devotion Aura': {
      code: 'ahad',
      types: [HotKeyType.Train],
    },
    'Divine Shield': {
      code: 'ahds',
      types: [HotKeyType.BasicAbility, HotKeyType.Dodge, HotKeyType.Train],
    },
    Resurrection: {
      code: 'ahre',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  Archmage: {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    Blizzard: {
      code: 'ahbz',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Brilliance Aura': {
      code: 'ahab',
      types: [HotKeyType.Train],
    },
    'Summon Water Elemental': {
      code: 'ahwe',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    'Mass Teleport': {
      code: 'ahmt',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
  },
  'Mountain King': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    'Storm Bolt': {
      code: 'ahtb',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    Bash: {
      code: 'ahbh',
      types: [HotKeyType.Train],
    },
    'Thunder Clap': {
      code: 'ahtc',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    Avatar: {
      code: 'ahav',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  'Blood Mage': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    'Flame Strike': {
      code: 'ahfs',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    Banish: {
      code: 'ahbn',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Siphon Mana': {
      code: 'ahdr',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    Phoenix: {
      code: 'ahpx',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  Peasant: {
    Repair: { code: 'ahrp', types: [HotKeyType.Target] },
    'Call to Arms': { code: 'amil', types: [HotKeyType.BasicAbility] },
    'Town Hall': { code: 'htow', types: [HotKeyType.HumanBuild] },
    'Human Barracks': { code: 'hbar', types: [HotKeyType.HumanBuild] },
    'Lumber Mill': { code: 'hlum', types: [HotKeyType.HumanBuild] },
    Blacksmith: { code: 'hbla', types: [HotKeyType.HumanBuild] },
    Farm: { code: 'hhou', types: [HotKeyType.HumanBuild] },
    'Altar of Kings': { code: 'halt', types: [HotKeyType.HumanBuild] },
    'Arcane Sanctum': { code: 'hars', types: [HotKeyType.HumanBuild] },
    Workshop: { code: 'harm', types: [HotKeyType.HumanBuild] },
    'Scout Tower': { code: 'hwtw', types: [HotKeyType.HumanBuild] },
    'Gryphon Aviary': { code: 'hgra', types: [HotKeyType.HumanBuild] },
    'Arcane Vault': { code: 'hvlt', types: [HotKeyType.HumanBuild] },
  },
  Militia: {
    'Back To Work': { code: 'amil', types: [HotKeyType.BasicAbility] },
  },
  Footman: {
    Defend: { code: 'adef', types: [HotKeyType.BasicAbility] },
  },
  Priest: {
    Heal: { code: 'ahea', types: [HotKeyType.Target] },
    'Dispel Magic': {
      code: 'adis',
      types: [HotKeyType.MultiTarget, HotKeyType.Target],
    },
    'Inner Fire': {
      code: 'ainf',
      types: [HotKeyType.MultiTarget, HotKeyType.Target],
    },
  },
  Sorceress: {
    Slow: { code: 'aslo', types: [HotKeyType.MultiTarget, HotKeyType.Target] },
    Invisibility: { code: 'aivs', types: [HotKeyType.Target] },
    Polymorph: {
      code: 'aply',
      types: [HotKeyType.MultiTarget, HotKeyType.Target],
    },
  },
  'Mortar Team': {
    'Attack Ground': { code: 'cmdattackground', types: [HotKeyType.Target] },
    Flare: { code: 'afla', types: [HotKeyType.Target] },
  },
  'Dragonhawk Rider': {
    'Aerial Shackles': {
      code: 'amls',
      types: [HotKeyType.MultiTarget, HotKeyType.Target],
    },
  },
  'Town Hall': {
    Peasant: { code: 'hpea', types: [HotKeyType.BasicBuild] },
    Backpack: { code: 'rhpm', types: [HotKeyType.BasicUpgrade] },
    'Call to Arms': { code: 'amic', types: [HotKeyType.BasicAbility] },
    Keep: { code: 'hkee', types: [HotKeyType.BasicUpgrade] },
  },
  Keep: {
    Castle: { code: 'hcas', types: [HotKeyType.BasicUpgrade] },
  },
  'Human Barracks': {
    Footman: { code: 'hfoo', types: [HotKeyType.BasicBuild] },
    Rifleman: { code: 'hrif', types: [HotKeyType.BasicBuild] },
    Knight: { code: 'hkni', types: [HotKeyType.BasicBuild] },
    Defend: { code: 'rhde', types: [HotKeyType.BasicUpgrade] },
    'Long Rifles': { code: 'rhri', types: [HotKeyType.BasicUpgrade] },
    'Animal War Training': { code: 'rhan', types: [HotKeyType.BasicUpgrade] },
  },
  'Lumber Mill': {
    'Improved Masonry': { code: 'rhac', types: [HotKeyType.BasicUpgrade] },
    'Advanced Masonry': { code: 'rhac', types: [HotKeyType.BasicUpgrade] },
    'Imbued Masonry': { code: 'rhac', types: [HotKeyType.BasicUpgrade] },
    'Improved Lumber Harvesting': {
      code: 'rhlh',
      types: [HotKeyType.BasicUpgrade],
    },
    'Advanced Lumber Harvesting': {
      code: 'rhlh',
      types: [HotKeyType.BasicUpgrade],
    },
  },
  Blacksmith: {
    'Iron Forged Swords': { code: 'rhme', types: [HotKeyType.BasicUpgrade] },
    'Steel Forged Swords': { code: 'rhme', types: [HotKeyType.BasicUpgrade] },
    'Mithril Forged Swords': { code: 'rhme', types: [HotKeyType.BasicUpgrade] },
    'Iron Plating': { code: 'rhar', types: [HotKeyType.BasicUpgrade] },
    'Steel Plating': { code: 'rhar', types: [HotKeyType.BasicUpgrade] },
    'Mithril Plating': { code: 'rhar', types: [HotKeyType.BasicUpgrade] },
    'Black Gunpowder': { code: 'rhra', types: [HotKeyType.BasicUpgrade] },
    'Refined Gunpowder': { code: 'rhra', types: [HotKeyType.BasicUpgrade] },
    'Imbued Gunpowder': { code: 'rhra', types: [HotKeyType.BasicUpgrade] },
    'Studded Leather Armor': { code: 'rhla', types: [HotKeyType.BasicUpgrade] },
    'Reinforced Leather Armor': {
      code: 'rhla',
      types: [HotKeyType.BasicUpgrade],
    },
    'Dragonhide Armor': {
      code: 'rhla',
      types: [HotKeyType.BasicUpgrade],
    },
  },
  'Altar of Kings': {
    Archmage: { code: 'hamg', types: [HotKeyType.BasicBuild] },
    'Mountain King': { code: 'hmkg', types: [HotKeyType.BasicBuild] },
    Paladin: { code: 'hpal', types: [HotKeyType.BasicBuild] },
    'Blood Mage': { code: 'hblm', types: [HotKeyType.BasicBuild] },
  },
  'Arcane Sanctum': {
    Priest: { code: 'hmpr', types: [HotKeyType.BasicBuild] },
    Sorceress: { code: 'hsor', types: [HotKeyType.BasicBuild] },
    'Spell Breaker': { code: 'hspt', types: [HotKeyType.BasicBuild] },
    'Priest Adept Training': { code: 'rhpt', types: [HotKeyType.BasicUpgrade] },
    'Priest Master Training': {
      code: 'rhpt',
      types: [HotKeyType.BasicUpgrade],
    },
    'Sorceress Adept Training': {
      code: 'rhst',
      types: [HotKeyType.BasicUpgrade],
    },
    'Sorceress Master Training': {
      code: 'rhst',
      types: [HotKeyType.BasicUpgrade],
    },
    'Magic Sentry': { code: 'rhse', types: [HotKeyType.BasicUpgrade] },
    'Control Magic': { code: 'rhss', types: [HotKeyType.BasicUpgrade] },
  },
  Workshop: {
    'Flying Machine': { code: 'hgyr', types: [HotKeyType.BasicBuild] },
    'Mortar Team': { code: 'hmtm', types: [HotKeyType.BasicBuild] },
    'Siege Engine': { code: 'hmtt', types: [HotKeyType.BasicBuild] },
    'Flying Machine Bombs': { code: 'rhgb', types: [HotKeyType.BasicUpgrade] },
    Flare: { code: 'rhfl', types: [HotKeyType.BasicUpgrade] },
    Barrage: { code: 'rhrt', types: [HotKeyType.BasicUpgrade] },
    'Flak Cannons': { code: 'rhfc', types: [HotKeyType.BasicUpgrade] },
    'Fragmentation Shards': { code: 'rhfs', types: [HotKeyType.BasicUpgrade] },
  },
  'Scout Tower': {
    'Guard Tower': { code: 'hgtw', types: [HotKeyType.BasicUpgrade] },
    'Cannon Tower': { code: 'hctw', types: [HotKeyType.BasicUpgrade] },
    'Arcane Tower': { code: 'hatw', types: [HotKeyType.BasicUpgrade] },
  },
  'Cannon Tower': {
    'Attack Ground': { code: 'cmdattackground', types: [HotKeyType.Target] },
  },
  'Arcane Tower': {
    Reveal: { code: 'ahta', types: [HotKeyType.Target] },
  },
  'Gryphon Aviary': {
    'Gryphon Rider': { code: 'hgry', types: [HotKeyType.BasicBuild] },
    'Dragonhawk Rider': { code: 'hdhw', types: [HotKeyType.BasicBuild] },
    'Storm Hammers': { code: 'rhhb', types: [HotKeyType.BasicUpgrade] },
    Cloud: { code: 'rhcd', types: [HotKeyType.BasicUpgrade] },
  },
  'Arcane Vault': {
    'Scroll of Regeneration': { code: 'sreg', types: [HotKeyType.BasicBuy] },
    'Mechanical Critter': { code: 'mcri', types: [HotKeyType.BasicBuy] },
    'Lesser Clarity Potion': { code: 'plcl', types: [HotKeyType.BasicBuy] },
    'Potion of Healing': { code: 'phea', types: [HotKeyType.BasicBuy] },
    'Potion of Mana': { code: 'pman', types: [HotKeyType.BasicBuy] },
    'Scroll of Town Portal': { code: 'stwp', types: [HotKeyType.BasicBuy] },
    'Ivory Tower': { code: 'tsct', types: [HotKeyType.BasicBuy] },
    'Orb of Slow': { code: 'oslo', types: [HotKeyType.BasicBuy] },
    'Staff of Sanctuary': { code: 'ssan', types: [HotKeyType.BasicBuy] },
  },
};

export const Neutral: any = {
  'Naga Sea Witch': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    'Forked Lightning': {
      code: 'anfl',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Frost Arrows': {
      code: 'anfa',
      types: [HotKeyType.Train],
    },
    'Mana Shield': {
      code: 'anms',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    Tornado: {
      code: 'anto',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  'Dark Ranger': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    Silence: {
      code: 'ansi',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Black Arrow': {
      code: 'anba',
      types: [HotKeyType.Train],
    },
    'Life Drain': {
      code: 'andr',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    Charm: {
      code: 'anch',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
  },
  'Pandaren Brewmaster': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    'Breath of Fire': {
      code: 'anbf',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Drunken Haze': {
      code: 'andh',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Drunken Brawler': {
      code: 'andb',
      types: [HotKeyType.Train],
    },
    'Storm, Earth, and Fire': {
      code: 'anef',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  Beastmaster: {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    'Summon Bear': {
      code: 'ansg',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    'Summon Quilbeast': {
      code: 'ansq',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    'Summon Hawk': {
      code: 'answ',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    Stampede: {
      code: 'anst',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  'Pit Lord': {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    'Rain of Fire': {
      code: 'anrf',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Howl of Terror': {
      code: 'anht',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    'Cleaving Attack': {
      code: 'anca',
      types: [HotKeyType.Train],
    },
    Doom: {
      code: 'ando',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
  },
  Tinker: {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    'Pocket Factory': {
      code: 'ansy',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Cluster Rockets': {
      code: 'ancs',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Engineering Upgrade': {
      code: 'aneg',
      types: [HotKeyType.Train],
    },
    'Robo-Goblin': {
      code: 'anrg',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
  },
  Alchemist: {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    'Healing Spray': {
      code: 'anhs',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Acid Bomb': {
      code: 'ancr',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    'Chemical Rage': {
      code: 'anab',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    Transmute: {
      code: 'antm',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
  },
  Firelord: {
    SelectFirstHero: { code: 'her1', types: [HotKeyType.BasicSelect] },
    SelectSecondHero: { code: 'her2', types: [HotKeyType.BasicSelect] },
    SelectThirdHero: { code: 'her3', types: [HotKeyType.BasicSelect] },
    'Soul Burn': {
      code: 'anso',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
    Incinerate: {
      code: 'ania',
      types: [HotKeyType.Train],
    },
    'Summon Lava Spawn': {
      code: 'anlm',
      types: [HotKeyType.BasicAbility, HotKeyType.Train],
    },
    Volcano: {
      code: 'anvc',
      types: [HotKeyType.Target, HotKeyType.Train],
    },
  },
  'Storm Brewmaster': {
    'Wind Walk': {
      code: 'anwk',
      types: [HotKeyType.BasicSelect, HotKeyType.Dodge],
    },
    Cyclone: { code: 'accy', types: [HotKeyType.Target] },
    'Dispel Magic': { code: 'adsm', types: [HotKeyType.Target] },
  },
  'Earth Brewmaster': {
    Taunt: { code: 'anta', types: [HotKeyType.BasicSelect] },
  },
  'Summon Bear': {
    Blink: { code: 'anbl', types: [HotKeyType.Target] },
  },
  'Summon Quilbeast': {
    Frenzy: { code: 'afzy', types: [HotKeyType.BasicAbility] },
  },
  'Doom Guard': {
    'Rain of Fire': { code: 'acrf', types: [HotKeyType.Target] },
    'War Stomp': { code: 'awrs', types: [HotKeyType.BasicAbility] },
    'Dispel Magic': { code: 'adsm', types: [HotKeyType.Target] },
    Cripple: { code: 'accr', types: [HotKeyType.Target] },
  },
  'Cloak of Shadows': {
    Shadowmeld: { code: 'aihm', types: [HotKeyType.BasicAbility] },
  },
  'Goblin Sapper': {
    Kaboom: { code: 'asds', types: [HotKeyType.Target] },
  },
  'Goblin Zeppelin': {
    Load: { code: 'aloa', types: [HotKeyType.Target] },
    'Unload All': { code: 'adro', types: [HotKeyType.Target] },
  },
  'Goblin Merchant': {
    'Boots Of Speed': { code: 'bspd', types: [HotKeyType.BasicBuy] },
    'Periapt of Vitality': { code: 'prvt', types: [HotKeyType.BasicBuy] },
    'Circlet of Nobility': { code: 'cnob', types: [HotKeyType.BasicBuy] },
    'Dust of Appearance': { code: 'dust', types: [HotKeyType.BasicBuy] },
    'Scroll of Protection': { code: 'spro', types: [HotKeyType.BasicBuy] },
    'Potion of Invisibility': { code: 'pinv', types: [HotKeyType.BasicBuy] },
    'Scroll of Town Portal': { code: 'stwp', types: [HotKeyType.BasicBuy] },
    'Staff of Teleportation': { code: 'stel', types: [HotKeyType.BasicBuy] },
    'Tome of Retraining': { code: 'tret', types: [HotKeyType.BasicBuy] },
    'Scroll of Healing': { code: 'shea', types: [HotKeyType.BasicBuy] },
    'Potion of Lesser Invulnerability': {
      code: 'pnvl',
      types: [HotKeyType.BasicBuy],
    },
  },
  'Goblin Laboratory': {
    'Goblin Sapper': { code: 'ngsp', types: [HotKeyType.BasicBuild] },
    'Goblin Zeppelin': { code: 'nzep', types: [HotKeyType.BasicBuild] },
    'Goblin Shredder': { code: 'ngir', types: [HotKeyType.BasicBuild] },
    Reveal: { code: 'andt', types: [HotKeyType.Target] },
  },
  Tavern: {
    'Naga Sea Witch': { code: 'nngs', types: [HotKeyType.BasicBuild] },
    'Dark Ranger': { code: 'nbrn', types: [HotKeyType.BasicBuild] },
    'Pandaren Brewmaster': { code: 'npbm', types: [HotKeyType.BasicBuild] },
    Firelord: { code: 'nfir', types: [HotKeyType.BasicBuild] },
    'Pit Lord': { code: 'nplh', types: [HotKeyType.BasicBuild] },
    Beastmaster: { code: 'nbst', types: [HotKeyType.BasicBuild] },
    Tinker: { code: 'ntin', types: [HotKeyType.BasicBuild] },
    Alchemist: { code: 'nalc', types: [HotKeyType.BasicBuild] },
  },
  'Mercenary Camp': {
    'Forest Troll Shadow Priest': {
      code: 'nfsp',
      types: [HotKeyType.BasicBuild],
    },
    'Forest Troll Berserker': { code: 'nftb', types: [HotKeyType.BasicBuild] },
    'Mud Golem': { code: 'ngrk', types: [HotKeyType.BasicBuild] },
    'Ogre Mauler': { code: 'nogm', types: [HotKeyType.BasicBuild] },
    'Ice Troll Priest': { code: 'nitp', types: [HotKeyType.BasicBuild] },
    'Ice Troll Berserker': { code: 'nits', types: [HotKeyType.BasicBuild] },
  },
};

export const actions = {
  ...Basic,
  ...NightElf,
  ...Undead,
  ...Orc,
  ...Human,
  ...Neutral,
  ..._merge(
    _merge(
      _merge(
        _merge(_merge({}, BasicInventory), NightElfInventory),
        UndeadInventory,
      ),
      OrcInventory,
    ),
    HumanInventory,
  ),
};

export const night_elf_actions = {
  ..._merge(_merge({}, BasicInventory), NightElfInventory),
  ...NightElf,
};

export const undead_actions = {
  ..._merge(_merge({}, BasicInventory), UndeadInventory),
  ...Undead,
};

export const orc_actions = {
  ..._merge(_merge({}, BasicInventory), OrcInventory),
  ...Orc,
};

export const human_actions = {
  ..._merge(_merge({}, BasicInventory), HumanInventory),
  ...Human,
};

export const neutral_actions = {
  ...Neutral,
};

export const all_actions = {
  ...NightElf,
  ...Undead,
  ...Orc,
  ...Human,
  ...Neutral,
  ..._merge(
    _merge(
      _merge(
        _merge(_merge({}, BasicInventory), NightElfInventory),
        UndeadInventory,
      ),
      OrcInventory,
    ),
    HumanInventory,
  ),
};

export const getCodeFromAction = (name: string, action: string) => {
  const a = action.replace('HeroAbilitiesTrain', '');
  const result =
    actions?.[name]?.[a]?.code ?? actions?.[a]?.code ?? actions?.[a] ?? a;
  return result;
};

export const createActions = (action: string, type: HotKeyType) => {
  switch (type) {
    case HotKeyType.BasicItem:
    case HotKeyType.BasicAbility:
    case HotKeyType.BasicBuild:
    case HotKeyType.BasicBuy:
    case HotKeyType.BasicUpgrade:
    case HotKeyType.BasicSelect:
      return [action];
    case HotKeyType.Use:
      return [action, action];
    case HotKeyType.MultiTarget:
      return action === 'Healing Salve'
        ? [
            action,
            Basic.TargetDummy,
            action,
            Basic.TargetDummy,
            action,
            Basic.TargetDummy,
          ]
        : [action, Basic.TargetDummy, action, Basic.TargetDummy];
    case HotKeyType.Target:
      return [action, Basic.TargetDummy];
    case HotKeyType.Dodge:
      return [Basic.MissileDodge, action];
    case HotKeyType.Train:
      return ['HeroAbilities', `HeroAbilitiesTrain${action}`];
    case HotKeyType.NightElfBuild:
      return ['NightElfBuild', action];
    case HotKeyType.UndeadBuild:
      return ['UndeadBuild', action];
    case HotKeyType.OrcBuild:
      return ['OrcBuild', action];
    case HotKeyType.HumanBuild:
      return ['HumanBuild', action];
    default:
      throw Error(` [${action}]: Unable to create actions for type [${type}]`);
  }
};

export const createPuzzles = (source: any, name: string) => {
  return _flatten(
    _map(source?.[name], (data, action) => {
      return data.types.map((t: HotKeyType) => ({
        name,
        type: t,
        actions: createActions(action, t),
      }));
    }),
  );
};

export const actionToName = (action: string) => {
  switch (action) {
    case 'HumanBuild':
    case 'OrcBuild':
      return 'Build Structure';
    case 'NightElfBuild':
      return 'Create Building';
    case 'UndeadBuild':
      return 'Summon Building';
    case Basic.TargetDummy:
      return 'on Target';
    case Basic.MissileDodge:
      return 'Dodge incoming projectile with ';
    case 'HeroAbilities':
      return 'Train';
    case 'SelectFirstHero':
      return 'First Hero';
    case 'SelectSecondHero':
      return 'Second Hero';
    case 'SelectThirdHero':
      return 'Third Hero';
    default:
      return `${action.replace('HeroAbilitiesTrain', '')}`;
  }
};
