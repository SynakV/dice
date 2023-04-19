import { deepClone } from 'src/utils/common/helpers';
import {
  DeskType,
  RoundType,
  StageType,
  CurrentType,
} from 'src/utils/common/types';

export const DEFAULT_STAGE: StageType = {
  winners: [],
  rankings: [],
  isStarted: false,
  isCompleted: false,
  isPlayerThrew: false,
};

export const DEFAULT_ROUND: RoundType = {
  winners: [],
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
    isLastRound: false,
    isGameEnded: false,
    isGameStarted: false,
    isShowConclusion: false,
    rounds: [deepClone(DEFAULT_ROUND)],
    max: {
      wins: 2,
      stages: 2,
      players: 2,
    },
    current: deepClone(DEFAULT_CURRENT),
  },
};
