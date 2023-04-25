import React from "react";
import Image from "next/image";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { useGame } from "@utils/contexts/GameContext";
import { getNameFormatted } from "@utils/helpers/common.helper";

export const Status = () => {
  const { desk } = useDesk();
  const portal = usePortal();
  const { player } = useGame();

  const isFirstStage = desk.gameplay.current.stage === 0;

  const currentPlayersId = desk.gameplay.current.player?.id;
  const currentPlayersName = getNameFormatted(
    desk.gameplay.current.player?.name || ""
  );

  const isYouCurrentPlayer = currentPlayersId === player?.id;

  const currentRound = desk.gameplay.rounds[desk.gameplay.current.round];
  const currentStage = currentRound.stages[desk.gameplay.current.stage];

  const getStatus = () => {
    if (desk.gameplay.isShowConclusion) {
      return "Results";
    }

    if (isFirstStage) {
      if (desk.gameplay.players.length !== desk.gameplay.max.players) {
        return "Waiting for all players to join...";
      }

      if (!desk.gameplay.isGameStarted) {
        return player?.id === desk.gameplay.players[0]?.id
          ? 'Click "Start game"'
          : "Waiting for game to start...";
      }

      if (!currentStage.isStarted && !currentStage.isPlayerThrew) {
        return isYouCurrentPlayer
          ? "Your turn to roll dice"
          : `${currentPlayersName}'s turn to roll dice`;
      }

      if (currentStage.isStarted && !currentStage.isPlayerThrew) {
        return isYouCurrentPlayer
          ? "Rolling dice..."
          : `${currentPlayersName} is rolling dice...`;
      }

      if (!currentStage.isStarted && currentStage.isPlayerThrew) {
        return isYouCurrentPlayer
          ? "Throwing dice..."
          : `${currentPlayersName} is throwing dice...`;
      }
    } else {
      if (!currentStage.isStarted && !currentStage.isPlayerThrew) {
        return isYouCurrentPlayer
          ? "Select dice for re-roll"
          : `${currentPlayersName} is thinking to re-roll dice...`;
      }

      if (currentStage.isStarted && !currentStage.isPlayerThrew) {
        return isYouCurrentPlayer
          ? "Re-rolling dice..."
          : `${currentPlayersName} is re-rolling dice...`;
      }

      if (!currentStage.isStarted && currentStage.isPlayerThrew) {
        return isYouCurrentPlayer
          ? "Throwing dice..."
          : `${currentPlayersName} is throwing dice...`;
      }
    }
  };

  return portal(
    <div className="status">
      <Image fill alt="grunge-border" src="/images/grunge-banner.png" />
      <div className="status__text">{getStatus()}</div>
    </div>
  );
};
