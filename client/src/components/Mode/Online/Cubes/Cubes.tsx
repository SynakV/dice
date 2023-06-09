import Image from "next/image";
import { DICE } from "@utils/constants";
import React, { FC, useEffect } from "react";
import { Cube } from "@components/Mode/Shared/Desk/Cube/Cube";
import { CubesType, PLAYER_STATUS, PlayerType } from "@utils/common/types";
import {
  getNonEqualInt,
  getRandomIntsFromInterval,
} from "@utils/helpers/randomizer.helper";
import {
  getRanking,
  getReRollIndexes,
} from "@utils/helpers/ranking/ranking.helper";
import { useDesk } from "@utils/contexts/DeskContext";
import {
  getCubesReroll,
  getDiceForReroll,
  getCurrentRanking,
} from "@utils/helpers/gameplay/cubes.helper";
import { useGame } from "@utils/contexts/GameContext";
import { Hand } from "@components/Mode/Shared/Hand/Hand";
import { playSound } from "@utils/contexts/MediaProvider";
import { useCursor } from "@utils/contexts/CursorProvider";
import { getAdmin } from "@utils/helpers/gameplay/gameplay.online.helper";

const DEFAULT_CUBES = new Array(DICE.COUNT).fill(null);

interface Props {
  player: PlayerType;
}

export const Cubes: FC<Props> = ({ player }) => {
  const Cursor = useCursor();
  const { handle, desk } = useDesk();
  const { player: you, setIsControlsLoading } = useGame();

  const isOtherPlayer = player.id !== you?.id;
  const isCurrentPlayerOnline =
    desk.gameplay.players.find(
      (player) => player.id === desk.gameplay.current.player?.id
    )?.status === PLAYER_STATUS.ONLINE;

  const isYouAdmin = getAdmin(desk)?.id === player?.id;

  const isCurrentPlayerTurn = desk.gameplay.current.player?.id === player.id;

  const round = desk.gameplay.rounds[desk.gameplay.current.round];
  const stage = round.stages[desk.gameplay.current.stage];

  const ranking = getCurrentRanking(desk, player);
  const { roll, reroll } = ranking?.cubes || {};

  // Round flow
  useEffect(() => {
    if (
      !stage.isStarted ||
      stage.isCompleted ||
      !isCurrentPlayerTurn ||
      (isOtherPlayer && isCurrentPlayerOnline)
    ) {
      return;
    }

    // FIRST STAGE (Roll)
    if (desk.gameplay.current.stage === 0) {
      handleRollDice();
    }

    // LAST STAGE (Re-Roll)
    else {
      if (!isOtherPlayer || !isCurrentPlayerOnline) {
        return handleReRollDice();
      }

      if (isOtherPlayer && !reroll && ranking) {
        const reRollIndexes = getReRollIndexes(ranking);
        const cubesReroll = handleSelectDie(reRollIndexes);
        return handleReRollDice({ roll, reroll: cubesReroll });
      }
    }
  }, [desk]);

  const handleRollDice = () => {
    playSound("handMixDice", true).onended = () => {
      handleSetRoll();
    };
  };

  const handleReRollDice = (cubes?: CubesType) => {
    if (!ranking) {
      return;
    }

    const newCubes = getDiceForReroll(cubes || ranking.cubes) || [];

    playSound("handMixDice", true).onended = () => {
      handleSetRoll(newCubes);
    };
  };

  const handleSelectDie = (index: number | number[]) => {
    if (ranking?.cubes) {
      setIsControlsLoading(true);
      const selectedDice = getCubesReroll(index, ranking?.cubes);
      handle.selectDice(selectedDice);

      return selectedDice;
    }
  };

  const handleSetRoll = (roll?: number[]) => {
    const newCubes = roll || getRandomIntsFromInterval();
    const newRanking = getRanking(newCubes);

    handle.throwDice({
      ...newRanking,
      player,
      cubes: { roll: newCubes },
      stage: desk.gameplay.current.stage,
    });

    playSound("handThrowDice", true).onended = () => {
      handle.finishThrowDice();
    };
  };

  const isDisableCube =
    !isCurrentPlayerTurn ||
    isOtherPlayer ||
    !round.stages[0].isCompleted ||
    stage.isStarted ||
    stage.isPlayerThrew;

  const isRollAnimationNumber = stage.isStarted && isCurrentPlayerTurn;

  const isHighlightPlayer =
    isCurrentPlayerTurn && !desk.gameplay.isShowConclusion;

  return (
    <Hand
      player={player.name}
      id={`player-${player.id}`}
      ranking={ranking?.value.name}
      className={`${isHighlightPlayer ? "hand--highlight" : ""}`}
    >
      {isYouAdmin && (
        <Cursor id="caretaker" hint="Caretaker" highlight={false}>
          <Image
            width={30}
            height={30}
            alt="grunge-caretaker"
            src="/images/grunge-caretaker.png"
            className={`caretaker ${
              isHighlightPlayer ? "caretaker--highlight" : ""
            }`}
          />
        </Cursor>
      )}
      <Image
        fill
        alt="grunge-rect"
        className="hand__rect"
        src="/images/grunge-rect.png"
      />
      {(roll || DEFAULT_CUBES).map((cube, index) => {
        const isAllowSelectedAnimation =
          !!reroll?.[index] || desk.gameplay.current.stage === 0;

        const rollAnimationNumber =
          isRollAnimationNumber &&
          isAllowSelectedAnimation &&
          getNonEqualInt(cube || 1);

        return (
          <Cube
            key={index}
            value={cube}
            index={index}
            isDisabled={isDisableCube}
            isSelected={!!reroll?.[index]}
            Cursor={isOtherPlayer ? null : Cursor}
            onClick={() => handleSelectDie(index)}
            rollAnimationNumber={rollAnimationNumber}
          />
        );
      })}
    </Hand>
  );
};
