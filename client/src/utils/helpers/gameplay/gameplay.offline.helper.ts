import { getRankingsComparisonWinner } from "@utils/helpers/ranking/ranking.helper";
import {
  DeskType,
  RerollType,
  SettingsType,
  RankingWithInfoType,
  PlayerType,
} from "@utils/common/types";
import { getRandomInt } from "@utils/helpers/randomizer.helper";
import {
  DEFAULT_STAGE,
  DEFAULT_ROUND,
  DEFAULT_CURRENT,
} from "@utils/common/constants";
import { NAMES } from "@utils/constants";
import { deepClone } from "@utils/common/helpers";

export const afterStartGame = (prev: DeskType): DeskType => ({
  ...prev,
  gameplay: {
    ...prev.gameplay,
    isGameStarted: true,
    current: {
      ...prev.gameplay.current,
      player: prev.gameplay.players[0],
    },
  },
});

export const afterStartThrowDice = (prev: DeskType): DeskType => ({
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
  },
});

export const afterThrowDice = (
  prev: DeskType,
  ranking: RankingWithInfoType
): DeskType => ({
  ...prev,
  gameplay: {
    ...prev.gameplay,
    rounds: prev.gameplay.rounds.map((round, index) => {
      const isCurrentRound = prev.gameplay.current.round === index;

      if (!isCurrentRound) {
        return round;
      }

      round.stages.map((stage, index) => {
        const isCurrentStage = prev.gameplay.current.stage === index;

        if (isCurrentStage) {
          stage.isStarted = false;
          stage.isPlayerThrew = true;
          stage.rankings.push(ranking);
        }

        return stage;
      });

      return round;
    }),
  },
});

export const afterFinishThrowDice = (prev: DeskType): DeskType => {
  const nextPlayer = getNextPlayer(prev);
  const isLastStage =
    prev.gameplay.current.stage === prev.gameplay.max.stages - 1;
  const isLastPlayerDidntThrowYet =
    prev.gameplay.current.player?.id !== prev.gameplay.players.at(-1)?.id;
  const isRoundCompleted = isLastStage && !isLastPlayerDidntThrowYet;

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
            stage.isStarted = true;
            stage.isPlayerThrew = false;
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

        if (isRoundCompleted) {
          round.isCompleted = true;
          round.winners = getRankingsComparisonWinner(
            round.stages[prev.gameplay.current.stage].rankings
          );
        }

        return round;
      }),
      isShowConclusion: isRoundCompleted,
      current: {
        ...prev.gameplay.current,
        player: nextPlayer,
        stage:
          !isLastStage && !isLastPlayerDidntThrowYet
            ? ++prev.gameplay.current.stage
            : prev.gameplay.current.stage,
      },
    },
  };
};

export const afterPassThrowDice = (prev: DeskType): DeskType => {
  return afterFinishThrowDice({
    ...prev,
    gameplay: {
      ...prev.gameplay,
      rounds: prev.gameplay.rounds.map((round, index) => {
        const isCurrentRound = prev.gameplay.current.round === index;

        if (!isCurrentRound) {
          return round;
        }

        round.stages.map((stage, index) => {
          const isCurrentStage = prev.gameplay.current.stage === index;

          if (isCurrentStage) {
            const previousStageRanking =
              round.stages[index - 1].rankings[stage.rankings.length];
            stage.rankings.push(previousStageRanking);
          }

          return stage;
        });

        return round;
      }),
    },
  });
};

export const afterSelectDice = (
  prev: DeskType,
  selectedDice: RerollType
): DeskType => ({
  ...prev,
  gameplay: {
    ...prev.gameplay,
    rounds: prev.gameplay.rounds.map((round, index) => {
      const isCurrentRound = prev.gameplay.current.round === index;

      if (!isCurrentRound) {
        return round;
      }

      round.stages.map((stage, index) => {
        const isPreviousStage = prev.gameplay.current.stage - 1 === index;

        if (!isPreviousStage) {
          return stage;
        }

        stage.rankings.map((ranking) => {
          const isPlayersRanking =
            prev.gameplay.current.player?.id === ranking.player.id;

          if (isPlayersRanking) {
            ranking.cubes.reroll = selectedDice;
          }

          return ranking;
        });

        return stage;
      });

      return round;
    }),
  },
});

export const afterCloseConclusion = (
  prev: DeskType,
  isLastRound: boolean
): DeskType => ({
  ...prev,
  gameplay: {
    ...prev?.gameplay,
    isShowConclusion: false,
    isGameEnded: isLastRound,
    rounds: [...prev.gameplay.rounds, deepClone(DEFAULT_ROUND)],
    current: {
      ...prev.gameplay.current,
      round: ++prev.gameplay.current.round,
      stage: 0,
    },
  },
});

export const afterEndGame = (prev: DeskType): DeskType => ({
  ...prev,
  gameplay: {
    ...prev.gameplay,
    isGameEnded: false,
    isGameStarted: false,
    rounds: [deepClone(DEFAULT_ROUND)],
    current: deepClone(DEFAULT_CURRENT),
  },
});

export const afterChangeSettings = (
  prev: DeskType,
  settings: SettingsType,
  player: PlayerType
): DeskType => {
  return {
    ...prev,
    gameplay: {
      ...prev.gameplay,
      isGameEnded: false,
      isGameStarted: false,
      rounds: [deepClone(DEFAULT_ROUND)],
      max: {
        wins: settings.wins,
        stages: settings.stages,
        players: settings.players,
      },
      players: getPlayers(settings.players - 1, player),
      current: deepClone(DEFAULT_CURRENT),
    },
  };
};

export const getPlayer = (name: string): PlayerType => ({
  name,
  id: Math.random().toString(),
});

export const getPlayers = (count: number, player: PlayerType) => {
  const ids: string[] = [player.id];
  const names: string[] = [player.name];
  const players: PlayerType[] = [player];

  for (let i = 1; i <= count; i++) {
    const id = Math.random().toString();
    const name = NAMES[getRandomInt(0, NAMES.length - 1)];

    if (!names.includes(name) && !ids.includes(id)) {
      players.push({
        id,
        name,
      });
    }
  }

  return players;
};

const getNextPlayer = (desk: DeskType) => {
  const currentPlayerIndex = desk.gameplay.players.findIndex(
    (player) => player.id === desk.gameplay.current.player?.id
  );

  const nextPlayer = desk.gameplay.players[currentPlayerIndex + 1];

  return nextPlayer ? nextPlayer : desk.gameplay.players[0];
};
