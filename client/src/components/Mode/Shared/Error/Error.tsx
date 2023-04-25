import Link from "next/link";
import Image from "next/image";
import { usePortal } from "@utils/hooks/usePortal";
import React, { FC, useEffect, useState } from "react";
import { Modal } from "@components/Shared/Modal/Modal";

export enum ERRORS {
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
      {type === ERRORS.GAME_ALREADY_STARTED && <GameAlreadyStarted />}
    </Modal>
  );
};

const GameAlreadyStarted = () => {
  return (
    <div className="error__main">
      <span className="error__text">
        <p>Sorry, you're late. Game already started.</p>
        <p>Got home page and join/create another desk.</p>
      </span>
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
