import { getRankingsComparisonWinner } from "../ranking/ranking.helper";
import {
  MESSAGES,
  DeskType,
  SettingsType,
  RankingResultWithInfoType,
} from "@utils/common/types";
import {
  DEFAULT_STAGE,
  DEFAULT_ROUND,
  DEFAULT_CURRENT,
} from "@utils/common/constants";
import type { Socket } from "socket.io-client";
import { deepClone } from "@utils/common/helpers";

export const afterStartGame = (prev: DeskType, socket: Socket): DeskType => {
  socket.emit(MESSAGES.DESK_CHANGE, {
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

  return prev;
};

export const afterTriggerStageStart = (
  prev: DeskType,
  socket: Socket
): DeskType => {
  const isNotFirstStage = prev.gameplay.current.stage !== 0;

  socket.emit(MESSAGES.DESK_CHANGE, {
    ...prev,
    gameplay: {
      ...prev.gameplay,
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
  });

  return prev;
};

export const afterThrowDice = (
  prev: DeskType,
  ranking: RankingResultWithInfoType,
  socket: Socket
): DeskType => {
  socket.emit(MESSAGES.DESK_CHANGE, {
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
            stage.rankings.push(ranking);
            stage.isStarted = false;
          }

          return stage;
        });

        return round;
      }),
    },
  });

  return prev;
};

export const afterStageFinish = (prev: DeskType, socket: Socket): DeskType => {
  const nextPlayer = getNextPlayer(prev);
  const isLastStage =
    prev.gameplay.current.stage === prev.gameplay.max.stages - 1;
  const isLastPlayerDidntThrowYet =
    prev.gameplay.current.player?.name !== prev.gameplay.players.at(-1)?.name;
  const stageThroughText = nextPlayer.name + " is thinking...";
  const stageFinishText = !isLastStage ? "Select dice for re-roll" : "Results";

  socket.emit(MESSAGES.DESK_CHANGE, {
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
  });
  return prev;
};

export const afterConclusionClose = (
  prev: DeskType,
  isLastRound: boolean,
  socket: Socket
): DeskType => {
  socket.emit(MESSAGES.DESK_CHANGE, {
    ...prev,
    gameplay: {
      ...prev.gameplay,
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

  return prev;
};

export const afterEndGame = (prev: DeskType, socket: Socket): DeskType => {
  socket.emit(MESSAGES.DESK_CHANGE, {
    ...prev,
    gameplay: {
      ...prev.gameplay,
      isGameEnded: false,
      isGameStarted: false,
      rounds: [deepClone(DEFAULT_ROUND)],
      current: {
        ...deepClone(DEFAULT_CURRENT),
        player: prev.gameplay.players[0],
      },
    },
  });

  return prev;
};

export const afterSettingsChange = (
  prev: DeskType,
  settings: SettingsType,
  socket: Socket
): DeskType => {
  socket.emit(MESSAGES.DESK_CHANGE, {
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
      current: {
        ...deepClone(DEFAULT_CURRENT),
        player: prev.gameplay.players[0],
      },
    },
  });

  return prev;
};

const getNextPlayer = (desk: DeskType) => {
  const currentPlayerIndex = desk.gameplay.players.findIndex(
    (player) => player.name === desk.gameplay.current.player?.name
  );

  const nextPlayer = desk.gameplay.players[currentPlayerIndex + 1];

  return nextPlayer ? nextPlayer : desk.gameplay.players[0];
};
