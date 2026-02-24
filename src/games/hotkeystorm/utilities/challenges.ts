import {
  BasicInventory,
  createPuzzles,
  HotKeyType,
  human_actions,
  Neutral,
} from '@/games/hotkeystorm/utilities/actions.ts';
import _keys from 'lodash/keys';

export const ArchmageFirstCamp = () => {
  const actions = {
    Archmage: {
      SelectFirstHero: human_actions.Archmage.SelectFirstHero,
      'Summon Water Elemental': {
        ...human_actions.Archmage['Summon Water Elemental'],
        types: [HotKeyType.Train, HotKeyType.BasicAbility],
      },
    },
    Command: {
      Move: { ...human_actions.Command.Move, types: [HotKeyType.Target] },
      Attack: { ...human_actions.Command.Attack, types: [HotKeyType.Target] },
    },
  };

  return {
    name: 'Basic Training: Archmage First Camp',
    random: false,
    puzzles: _keys(actions)
      .map((name) => createPuzzles(actions, name))
      .flat(),
  };
};

export const HumanStart = () => {
  const actions = {
    'Town Hall': {
      Peasant: {
        ...human_actions['Town Hall'].Peasant,
        types: [HotKeyType.BasicBuild],
      },
    },
    Peasant: {
      'Altar of Kings': {
        ...human_actions.Peasant['Altar of Kings'],
        types: [HotKeyType.HumanBuildAtLocation],
      },
      Farm: {
        ...human_actions.Peasant.Farm,
        types: [HotKeyType.HumanBuildAtLocation],
      },
      'Human Barracks': {
        ...human_actions.Peasant['Human Barracks'],
        types: [HotKeyType.HumanBuildAtLocation],
      },
    },
    'Altar of Kings': {
      Archmage: human_actions['Altar of Kings'].Archmage,
    },
  };

  return {
    name: 'Basic Training: Human Opening',
    random: false,
    puzzles: _keys(actions)
      .map((name) => createPuzzles(actions, name))
      .flat(),
  };
};

export const GoblinShop = () => {
  const actions = {
    'Goblin Merchant': Neutral['Goblin Merchant'],
  };

  return {
    name: 'Goblin Merchant',
    random: true,
    puzzles: _keys(actions)
      .map((name) => createPuzzles(actions, name))
      .flat(),
  };
};

export const Inventory = () => {
  const actions = {
    ...BasicInventory,
  };

  return {
    name: 'Basic Inventory Management',
    random: true,
    puzzles: _keys(actions)
      .map((name) => createPuzzles(actions, name))
      .flat(),
  };
};

export const DodgeMissile = () => {
  const actions = {
    Item2: {
      'Potion of Lesser Invulnerability': {
        code: 'itm2',
        types: [HotKeyType.Dodge],
      },
      'Potion of Greater Invulnerability': {
        code: 'itm2',
        types: [HotKeyType.Dodge],
      },
    },
    Item4: {
      'Potion of Lesser Invulnerability': {
        code: 'itm4',
        types: [HotKeyType.Dodge],
      },
    },
    Blademaster: {
      'Wind Walk': {
        code: 'aowk',
        types: [HotKeyType.Dodge],
      },
      'Mirror Image': {
        code: 'aomi',
        types: [HotKeyType.Dodge],
      },
    },
    Paladin: {
      'Divine Shield': {
        code: 'ahds',
        types: [HotKeyType.Dodge],
      },
    },
  };

  return {
    name: 'Dodgeball!',
    random: true,
    puzzles: _keys(actions)
      .map((name) => createPuzzles(actions, name))
      .flat(),
  };
};
