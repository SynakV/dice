import { deepClone } from './helpers';
import { CurrentType, DeskType, RoundType, StageType } from './types';

export const DEFAULT_STAGE: StageType = {
  rankings: [],
  isStarted: false,
  isCompleted: false,
};

export const DEFAULT_ROUND: RoundType = {
  isCompleted: false,
  stages: [deepClone(DEFAULT_STAGE)],
};

export const DEFAULT_CURRENT: CurrentType = {
  round: 0,
  stage: 0,
  player: null,
};

export const DEFAULT_DESK: DeskType = {
  gameplay: {
    players: [],
    isGameEnded: false,
    isGameStarted: false,
    rounds: [deepClone(DEFAULT_ROUND)],
    max: {
      wins: 2,
      stages: 2,
      players: 2,
    },
    current: deepClone(DEFAULT_CURRENT),
  },
};
