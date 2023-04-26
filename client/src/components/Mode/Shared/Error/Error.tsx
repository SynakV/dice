import Link from "next/link";
import Image from "next/image";
import { usePortal } from "@utils/hooks/usePortal";
import { Modal } from "@components/Shared/Modal/Modal";
import React, { FC, ReactNode, useEffect, useState } from "react";

export enum ERRORS {
  GAME_DOES_NOT_EXIST,
  GAME_ALREADY_STARTED,
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
      {type === ERRORS.GAME_ALREADY_STARTED && <GameAlreadyStarted />}
    </Modal>
  );
};

const ErrorBody = ({ text }: { text: ReactNode }) => {
  return (
    <div className="error__main">
      <span className="error__text">{text}</span>
      <Link href="/online">
        <Image
          width={50}
          height={50}
          alt="arrow-back"
          src="/images/arrow-back.png"
        />
      </Link>
    </div>
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
