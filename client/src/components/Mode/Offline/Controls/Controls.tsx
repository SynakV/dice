import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import {
  isPass,
  getCurrentRanking,
} from "@utils/helpers/gameplay/cubes.helper";
import { FadeIn } from "@components/Shared/FadeIn/FadeIn";
import { useCursor } from "@utils/contexts/CursorProvider";
import { Button } from "@components/Mode/Shared/Controls/Controls";
import {
  useMedia,
  playSound,
  MUSIC_NAME,
  VIDEO_NAME,
} from "@utils/contexts/MediaProvider";

export const Controls = () => {
  const portal = usePortal();
  const Cursor = useCursor();
  const { handle, desk } = useDesk();
  const { playMusic, playVideo } = useMedia();
  const { player, toggleGameOpen } = useGame();

  const handleGameStart = () => {
    handle.startGame();

    playMusic({
      name: MUSIC_NAME.FIGHT,
      isSwitchInPage: true,
      switchDuration: 1000,
    });

    playVideo({
      name: VIDEO_NAME.FIGHT,
      isSwitchInPage: true,
      videoFadeDuraion: 1000,
    });

    playSound("nextRoundStart");
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

  const isDisableToRoll = !isAllowedToRoll || desk.gameplay.isShowConclusion;

  const rollText = isFirstStageNotCompleted
    ? "Roll dice"
    : isPassing
    ? "Pass"
    : "Re-roll dice";

  return portal(
    <FadeIn className="controls">
      <Cursor hint="Settings" position="top-right" id="controls-settings">
        <Button
          position="left"
          text="Settings"
          onClick={() => toggleGameOpen(GAME_OPEN.SETTINGS)}
        />
      </Cursor>
      <Cursor
        position="top"
        hint="History"
        id="controls-history"
        isDisable={!isShowHistory}
      >
        <Button
          text="History"
          position="center"
          isDiabled={!isShowHistory}
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
        >
          <Button
            position="right"
            text="Start game"
            isDiabled={!isAllPlayersPresent}
            onClick={isAllPlayersPresent ? () => handleGameStart() : () => {}}
          />
        </Cursor>
      ) : (
        <Cursor
          hint={rollText}
          position="top-left"
          id="controls-right-corner"
          isDisable={isDisableToRoll}
        >
          <Button
            text={rollText}
            position="right"
            isDiabled={isDisableToRoll}
            onClick={isAllowedToRoll ? () => handleRollDice() : () => {}}
          />
        </Cursor>
      )}
    </FadeIn>
  );
};
