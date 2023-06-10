import Image from "next/image";
import { useDesk } from "@utils/contexts/DeskContext";
import { FadeIn } from "@components/Shared/FadeIn/FadeIn";
import { useCursor } from "@utils/contexts/CursorProvider";
import React, { FC, MouseEvent, useEffect, useState } from "react";
import { Placeholder } from "@components/Mode/Shared/Hand/Placeholder/Placeholder";

interface Props {
  cubes: React.FC<any>;
}

export const Desk: FC<Props> = ({ cubes: Cubes }) => {
  const Cursor = useCursor();
  const { handle, desk } = useDesk();

  const [isShowArrow, setIsShowArrow] = useState({
    top: false,
    bottom: false,
  });

  const {
    players,
    max,
    isGameEnded,
    current: { player },
  } = desk.gameplay;

  const placeholderPlayers =
    max.players - players.length < 0 ? 0 : max.players - players.length;

  useEffect(() => {
    if (isGameEnded) {
      handle.endGame();
    }
  }, [isGameEnded]);

  useEffect(() => {
    setTimeout(() => {
      handleUpdateScrollArrows();
    }, 1000);
  }, [desk]);

  useEffect(() => {
    if (!player?.id) {
      return;
    }

    const playersCubes = document.getElementById(`player-${player.id}`);

    if (playersCubes) {
      playersCubes.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [player]);

  const handleUpdateScrollArrows = (expectedScroll: number = 0) => {
    const desk = document.getElementById("desk");

    if (desk) {
      const expectedScrollTop = desk.scrollTop - expectedScroll;

      setIsShowArrow({
        top: expectedScrollTop > 0,
        bottom: !(expectedScrollTop >= desk.scrollHeight - desk.offsetHeight),
      });
    }
  };

  const handleScroll = (e: MouseEvent<HTMLImageElement>) => {
    const desk = document.getElementById("desk");

    if (!desk) {
      return;
    }

    const halfOfClientHeight = desk.clientHeight / 2;

    if (e.currentTarget.alt.includes("top")) {
      desk.scrollTo({
        top: desk.scrollTop - halfOfClientHeight,
        behavior: "smooth",
      });
      handleUpdateScrollArrows(halfOfClientHeight);
    } else {
      desk.scrollTo({
        top: desk.scrollTop + halfOfClientHeight,
        behavior: "smooth",
      });
      handleUpdateScrollArrows(-halfOfClientHeight);
    }
  };

  return (
    <FadeIn id="desk" className="desk">
      {players.map((player, index) => (
        <Cubes player={player} key={player.id || index} />
      ))}
      {new Array(placeholderPlayers).fill(null).map((_, index) => (
        <Placeholder key={index} player={players.length + index + 1} />
      ))}
      <Cursor
        hint="Up"
        position="bottom"
        id="desk-scroll-top"
        isDisable={!isShowArrow.top}
      >
        <Image
          width={60}
          height={35}
          onClick={handleScroll}
          alt="grunge-triangle-top"
          src="/images/grunge-triangle.png"
          className={`desk__triangle ${
            isShowArrow.top ? "" : "desk__triangle--disabled"
          }`}
        />
      </Cursor>
      <Cursor
        hint="Down"
        position="top"
        id="desk-scroll-bottom"
        isDisable={!isShowArrow.bottom}
      >
        <Image
          width={60}
          height={35}
          onClick={handleScroll}
          alt="grunge-triangle-bottom"
          src="/images/grunge-triangle.png"
          className={`desk__triangle ${
            isShowArrow.bottom ? "" : "desk__triangle--disabled"
          }`}
        />
      </Cursor>
    </FadeIn>
  );
};
