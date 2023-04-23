import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import {
  isPass,
  getCurrentRanking,
} from "@utils/helpers/gameplay/cubes.helper";
import { playAudio } from "@utils/helpers/audio.helper";
import { Button } from "@components/Mode/Shared/Controls/Controls";

export const Controls = () => {
  const portal = usePortal();
  const { handle, desk } = useDesk();
  const { player, toggleGameOpen } = useGame();

  const handleGameStart = () => {
    handle.startGame();
    playAudio("nextRoundStart");
  };

  const handleRollDice = () => {
    if (isPassing && desk.gameplay.current.stage !== 0) {
      handle.passThrowDice();
    } else {
      handle.startThrowDice();
    }
  };

  const ranking = getCurrentRanking(desk, player);
  const isPassing = isPass(ranking?.cubes.reroll);

  const isShowHistory =
    desk.gameplay.current.round > 0 || desk.gameplay.current.stage > 0;

  const currentPlayer = desk.gameplay.current.player?.id === player?.id;

  const rounds = desk.gameplay.rounds;
  const currentRound = rounds[desk.gameplay.current.round];
  const currentStage = currentRound.stages[desk.gameplay.current.stage];
  const isAllPlayersPresent =
    desk.gameplay.players.length === desk.gameplay.max.players;

  const isCurrentStageNotStarted = !currentStage.isStarted;
  const isCurrentPlayerThrew = currentStage.isPlayerThrew;
  const isFirstStageNotCompleted = !currentRound.stages[0].isCompleted;

  const isAllowedToRoll =
    isCurrentStageNotStarted && !isCurrentPlayerThrew && currentPlayer;

  return portal(
    <div className="controls">
      <Button
        position="left"
        text="Settings"
        onClick={() => toggleGameOpen(GAME_OPEN.SETTINGS)}
      />
      <Button
        text="History"
        position="center"
        isDiabled={!isShowHistory}
        onClick={
          isShowHistory ? () => toggleGameOpen(GAME_OPEN.HISTORY) : () => {}
        }
      />
      {!desk.gameplay.isGameStarted ? (
        <Button
          text="Start game"
          position="right"
          isDiabled={!isAllPlayersPresent}
          onClick={isAllPlayersPresent ? () => handleGameStart() : () => {}}
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
          isDiabled={!isAllowedToRoll || desk.gameplay.isShowConclusion}
          onClick={isAllowedToRoll ? () => handleRollDice() : () => {}}
        />
      )}
    </div>
  );
};
