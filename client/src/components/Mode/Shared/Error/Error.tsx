import Link from "next/link";
import Image from "next/image";
import { usePortal } from "@utils/hooks/usePortal";
import { Modal } from "@components/Shared/Modal/Modal";
import { useCursor } from "@utils/contexts/CursorProvider";
import React, { FC, ReactNode, useEffect, useState } from "react";

export enum ERRORS {
  GAME_DOES_NOT_EXIST,
  GAME_ALREADY_STARTED,
  GAME_FULL_OF_PLAYERS,
}

interface Props {
  type: ERRORS | null;
}

export const Error: FC<Props> = ({ type }) => {
  const portal = usePortal();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(type !== null);
  }, [type]);

  return portal(
    <Modal className="error" title="Oops..." isOpen={isOpen}>
      {type === ERRORS.GAME_DOES_NOT_EXIST && <GameDoesNotExist />}
      {type === ERRORS.GAME_FULL_OF_PLAYERS && <GameFullOfPlayers />}
      {type === ERRORS.GAME_ALREADY_STARTED && <GameAlreadyStarted />}
    </Modal>
  );
};

const ErrorBody = ({ text }: { text: ReactNode }) => {
  const Cursor = useCursor();

  return (
    <div className="error__main">
      <span className="error__text">{text}</span>
      <Link href="/online">
        <Cursor id="oops-back" hint="Back" position="bottom">
          <Image
            width={50}
            height={50}
            alt="arrow-back"
            src="/images/arrow-back.png"
          />
        </Cursor>
      </Link>
    </div>
  );
};

const GameDoesNotExist = () => {
  return (
    <ErrorBody
      text={
        <>
          <p>Sorry, seems like desk does not exist anymore.</p>
          <p>Go to home page and join/create another desk.</p>
        </>
      }
    />
  );
};

const GameFullOfPlayers = () => {
  return (
    <ErrorBody
      text={
        <>
          <p>Sorry, game is already full of players.</p>
          <p>Go to home page and join/create another desk.</p>
        </>
      }
    />
  );
};

const GameAlreadyStarted = () => {
  return (
    <ErrorBody
      text={
        <>
          <p>Sorry, you're late. Game already started.</p>
          <p>Go to home page and join/create another desk.</p>
        </>
      }
    />
  );
};
