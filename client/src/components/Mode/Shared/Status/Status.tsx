import React from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { getStorageObjectItem } from "@utils/helpers/storage/storage.helper";
import { CredentialsType } from "@components/Shared/Credentials/utils/types";

export const Status = () => {
  const { desk } = useDesk();
  const portal = usePortal();

  const player: CredentialsType = getStorageObjectItem(
    STORAGE_ITEMS.CREDENTIALS
  );

  const isFirstStage = desk.gameplay.current.stage === 0;

  const currentPlayersName = desk.gameplay.current.player?.name;
  const isYouCurrentPlayer = currentPlayersName === player?.name;

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
        return player?.name === desk.creator?.name
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
          : `${currentPlayersName}'s is thinking to re-roll dice...`;
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

  return portal(<div className="status">{getStatus()}</div>);
};
