import React from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import {
  isPass,
  getCurrentRanking,
} from "@utils/helpers/gameplay/cubes.helper";
import { Button } from "@components/Mode/Shared/Controls/Controls";

export const Controls = () => {
  const portal = usePortal();
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

  const ranking = getCurrentRanking(desk, player);
  const isPassing = isPass(ranking?.cubes.reroll);

  const isShowHistory =
    desk.gameplay.current.round > 0 || desk.gameplay.current.stage > 0;

  const rounds = desk.gameplay.rounds;
  const currentRound = rounds[desk.gameplay.current.round];
  const currentStage = currentRound.stages[desk.gameplay.current.stage];
  const isAllPlayersPresent =
    desk.gameplay.players.length === desk.gameplay.max.players;

  const isCurrentPlayerThrew = currentStage.isPlayerThrew;
  const isCurrentStageStarted = currentStage.isStarted;
  const isFirstStageNotCompleted = !currentRound.stages[0].isCompleted;
  const isCurrentPlayer = desk.gameplay.current.player?.id === player?.id;

  const isYouFirstPlayer = desk.gameplay.players[0]?.id === player?.id;

  const isAllowedToRoll =
    !isControlsLoading &&
    !isCurrentStageStarted &&
    !isCurrentPlayerThrew &&
    isCurrentPlayer;

  const isAllowToStartGame =
    !isControlsLoading && isAllPlayersPresent && isYouFirstPlayer;

  return portal(
    <div className="controls">
      {isYouFirstPlayer && (
        <Button
          position="left"
          text="Settings"
          onClick={() => toggleGameOpen(GAME_OPEN.SETTINGS)}
        />
      )}
      <Button
        text="History"
        isDiabled={!isShowHistory}
        position={isYouFirstPlayer ? "center" : "left"}
        onClick={
          isShowHistory ? () => toggleGameOpen(GAME_OPEN.HISTORY) : () => {}
        }
      />
      {!desk.gameplay.isGameStarted ? (
        <Button
          position="right"
          text="Start game"
          isLoading={isControlsLoading}
          isDiabled={!isAllowToStartGame}
          onClick={isAllowToStartGame ? () => handleStartGame() : () => {}}
        />
      ) : (
        <Button
          text={
            isFirstStageNotCompleted
              ? "Roll dice"
              : isPassing
              ? "Pass"
              : "Re-roll dice"
          }
          position="right"
          isLoading={isControlsLoading}
          isDiabled={!isAllowedToRoll || desk.gameplay.isShowConclusion}
          onClick={isAllowedToRoll ? () => handleRollDice() : () => {}}
        />
      )}
    </div>
  );
};
