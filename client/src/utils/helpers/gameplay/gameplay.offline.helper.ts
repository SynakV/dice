import { STORAGE_ITEMS } from "../storage/constants";
import { getStorageObjectItem } from "../storage/storage.helper";
import { getRankingsComparisonWinner } from "../ranking/ranking.helper";
import {
  DeskType,
  SettingsType,
  RankingResultWithInfoType,
} from "@utils/common/types";
import { getRandomNames } from "../randomizer.helper";
import {
  DEFAULT_STAGE,
  DEFAULT_ROUND,
  DEFAULT_CURRENT,
} from "@utils/common/constants";
import { deepClone } from "@utils/common/helpers";

export const afterTriggerStageStart = (prev: DeskType): DeskType => {
  const isNotFirstStage = prev.gameplay.current.stage !== 0;

  return {
    ...prev,
    gameplay: {
      ...prev?.gameplay,
      rounds: prev.gameplay.rounds.map((round) => {
        round.stages.map((stage, index) => {
          if (prev.gameplay.current.stage === index) {
            stage.isStarted = true;
          }
        });
        return round;
      }),
      current: {
        ...prev.gameplay.current,
        status:
          prev.gameplay.current.player?.name +
          " " +
          (!isNotFirstStage ? "rolling" : "re-rolling") +
          "...",
      },
    },
  };
};

export const afterStartGame = (prev: DeskType): DeskType => ({
  ...prev,
  gameplay: {
    ...prev.gameplay,
    isGameStarted: true,
  },
});

export const afterEndGame = (prev: DeskType): DeskType => ({
  ...prev,
  gameplay: {
    ...prev.gameplay,
    isGameEnded: false,
    isGameStarted: false,
    rounds: [deepClone(DEFAULT_ROUND)],
    current: {
      ...deepClone(DEFAULT_CURRENT),
      player: {
        name: getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name,
      },
    },
  },
});

export const afterThrowDice = (
  prev: DeskType,
  ranking: RankingResultWithInfoType
): DeskType => {
  const nextPlayer = getNextPlayer(prev);
  const isLastStage =
    prev.gameplay.current.stage === prev.gameplay.max.stages - 1;
  const isLastPlayerDidntThrowYet =
    prev.gameplay.current.player?.name !== prev.gameplay.players.at(-1)?.name;
  const stageThroughText =
    nextPlayer.name + (!isLastStage ? " rolling..." : " re-rolling");
  const stageFinishText = !isLastStage ? "Select dice for re-roll" : "Results";

  return {
    ...prev,
    gameplay: {
      ...prev?.gameplay,
      rounds: prev.gameplay.rounds.map((round, index) => {
        const isCurrentRound = prev.gameplay.current.round === index;

        if (!isCurrentRound) {
          return round;
        }

        round.stages.map((stage, index) => {
          const isCurrentStage = prev.gameplay.current.stage === index;

          if (isCurrentStage) {
            stage.rankings.push(ranking);
          }

          if (isLastPlayerDidntThrowYet) {
            return stage;
          }

          stage.isStarted = false;
          stage.isCompleted = true;
          stage.winners = getRankingsComparisonWinner(stage.rankings);

          if (!isLastStage && isCurrentStage) {
            round.stages.push(deepClone(DEFAULT_STAGE));
          }

          return stage;
        });

        if (isLastStage && !isLastPlayerDidntThrowYet) {
          round.isCompleted = true;
          round.winners = getRankingsComparisonWinner(
            round.stages[prev.gameplay.current.stage].rankings
          );
        }

        return round;
      }),
      current: {
        ...prev.gameplay.current,
        player: nextPlayer,
        status: isLastPlayerDidntThrowYet ? stageThroughText : stageFinishText,
        stage:
          !isLastStage && !isLastPlayerDidntThrowYet
            ? ++prev.gameplay.current.stage
            : prev.gameplay.current.stage,
      },
    },
  };
};

export const afterSettingsChange = (
  prev: DeskType,
  settings: SettingsType
): DeskType => ({
  ...prev,
  gameplay: {
    ...prev.gameplay,
    isGameEnded: false,
    rounds: [deepClone(DEFAULT_ROUND)],
    max: {
      wins: settings.wins,
      stages: settings.stages,
      players: settings.players,
    },
    players: [
      {
        name: getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name,
      },
      ...getRandomNames(settings.players - 1).map((name) => ({
        name,
      })),
    ],
    current: {
      ...deepClone(DEFAULT_CURRENT),
      player: {
        name: getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name,
      },
    },
  },
});

export const afterConclusionClose = (
  prev: DeskType,
  isLastRound: boolean
): DeskType => ({
  ...prev,
  gameplay: {
    ...prev?.gameplay,
    isGameEnded: isLastRound,
    rounds: [...prev.gameplay.rounds, deepClone(DEFAULT_ROUND)],
    current: {
      ...prev.gameplay.current,
      round: ++prev.gameplay.current.round,
      stage: 0,
      status: "",
    },
  },
});

const getNextPlayer = (desk: DeskType) => {
  const currentPlayerIndex = desk.gameplay.players.findIndex(
    (player) => player.name === desk.gameplay.current.player?.name
  );

  const nextPlayer = desk.gameplay.players[currentPlayerIndex + 1];

  return nextPlayer ? nextPlayer : desk.gameplay.players[0];
};
