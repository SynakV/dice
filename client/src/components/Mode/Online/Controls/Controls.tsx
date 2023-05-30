import React, { useEffect } from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import {
  isPass,
  getCurrentRanking,
} from "@utils/helpers/gameplay/cubes.helper";
import { PLAYER_STATUS } from "@utils/common/types";
import { FadeIn } from "@components/Shared/FadeIn/FadeIn";
import { useCursor } from "@utils/contexts/CursorProvider";
import { Button } from "@components/Mode/Shared/Controls/Controls";
import { getAdmin } from "@utils/helpers/gameplay/gameplay.online.helper";

export const Controls = () => {
  const portal = usePortal();
  const Cursor = useCursor();
  const { handle, desk } = useDesk();
  const { player, isControlsLoading, toggleGameOpen, setIsControlsLoading } =
    useGame();

  const handleStartGame = () => {
    handle.startGame();
    setIsControlsLoading(true);
  };

  const handleRollDice = () => {
    if (isPassing && desk.gameplay.current.stage !== 0) {
      handle.passThrowDice();
    } else {
      handle.startThrowDice();
    }
    setIsControlsLoading(true);
  };

  useEffect(() => {
    const currentPlayer = desk.gameplay.current.player;

    const isCurrentPlayerOffline =
      desk.gameplay.players.find((player) => player.id === currentPlayer?.id)
        ?.status === PLAYER_STATUS.OFFLINE;

    if (
      isCurrentRoundCompleted ||
      !isCurrentPlayerOffline ||
      isCurrentStageStarted ||
      isCurrentPlayerThrew ||
      !isYouAdmin
    ) {
      return;
    }

    const offlinePlayerRanking = getCurrentRanking(desk, currentPlayer);

    if (
      isPass(offlinePlayerRanking?.cubes.reroll) &&
      desk.gameplay.current.stage !== 0
    ) {
      handle.passThrowDice();
    } else {
      handle.startThrowDice();
    }

    setIsControlsLoading(true);
  }, [desk.gameplay.players]);

  const ranking = getCurrentRanking(desk, player);
  const isPassing = isPass(ranking?.cubes.reroll);

  const isShowHistory =
    desk.gameplay.current.round > 0 || desk.gameplay.current.stage > 0;

  const rounds = desk.gameplay.rounds;
  const currentRound = rounds[desk.gameplay.current.round];
  const currentStage = currentRound.stages[desk.gameplay.current.stage];
  const isAllPlayersPresent =
    desk.gameplay.players.length === desk.gameplay.max.players;

  const isCurrentRoundCompleted = currentRound.isCompleted;

  const isCurrentStageStarted = currentStage.isStarted;
  const isCurrentPlayerThrew = currentStage.isPlayerThrew;
  const isFirstStageNotCompleted = !currentRound.stages[0].isCompleted;
  const isYouCurrentPlayer = desk.gameplay.current.player?.id === player?.id;

  const isYouAdmin = getAdmin(desk)?.id === player?.id;

  const isAllowToStartGame = isAllPlayersPresent && isYouAdmin;

  const isAllowedToRoll =
    !isCurrentStageStarted &&
    !isCurrentPlayerThrew &&
    isYouCurrentPlayer &&
    !desk.gameplay.isShowConclusion;

  const rollText = isFirstStageNotCompleted
    ? "Roll dice"
    : isPassing
    ? "Pass"
    : "Re-roll dice";

  return portal(
    <FadeIn className="controls">
      {isYouAdmin && (
        <Cursor id="controls-settings" hint="Settings" position="top-right">
          <Button
            position="left"
            text="Settings"
            onClick={() => toggleGameOpen(GAME_OPEN.SETTINGS)}
          />
        </Cursor>
      )}
      <Cursor
        hint="History"
        id="controls-history"
        isDisable={!isShowHistory}
        position={isYouAdmin ? "top" : "top-right"}
      >
        <Button
          text="History"
          isDiabled={!isShowHistory}
          position={isYouAdmin ? "center" : "left"}
          onClick={
            isShowHistory ? () => toggleGameOpen(GAME_OPEN.HISTORY) : () => {}
          }
        />
      </Cursor>
      {!desk.gameplay.isGameStarted ? (
        <Cursor
          hint="Start game"
          position="top-left"
          id="controls-right-corner"
          isDisable={!isAllowToStartGame}
        >
          <Button
            position="right"
            text="Start game"
            isLoading={isControlsLoading}
            isDiabled={!isAllowToStartGame}
            onClick={isAllowToStartGame ? () => handleStartGame() : () => {}}
          />
        </Cursor>
      ) : (
        <Cursor
          hint={rollText}
          position="top-left"
          id="controls-right-corner"
          isDisable={!isAllowedToRoll}
        >
          <Button
            text={rollText}
            position="right"
            isDiabled={!isAllowedToRoll}
            isLoading={isControlsLoading}
            onClick={isAllowedToRoll ? () => handleRollDice() : () => {}}
          />
        </Cursor>
      )}
    </FadeIn>
  );
};
