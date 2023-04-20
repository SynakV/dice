import React, { FC, useRef } from "react";
import { CredentialsType } from "@utils/common/types";
import { useGame } from "@utils/contexts/GameContext";
import { Modal } from "@components/Shared/Modal/Modal";
import { useNotification } from "@components/Shared/Notification/Notification";

interface Props {
  isOpen: boolean;
  toggleIsOpen: () => void;
  setCredentials: (credentials: CredentialsType) => void;
}

export const Credentials: FC<Props> = ({
  isOpen,
  toggleIsOpen,
  setCredentials,
}) => {
  const name = useRef<HTMLInputElement>(null);

  const { player } = useGame();
  const { notification } = useNotification();

  const handleSetCredentials = () => {
    const value = name.current?.value;

    if (value) {
      setCredentials({ name: value });
    } else {
      notification("Name should not be empty");
    }
  };

  return (
    <Modal isOpen={isOpen} title="Enter your name">
      <div className="credentials__main">
        <span className="credentials__name">Name:</span>
        <input
          type="text"
          ref={name}
          defaultValue={player?.name}
          className="credentials__input"
        />
      </div>
      <div className="credentials__footer">
        <span className="credentials__close" onClick={toggleIsOpen}>
          Close
        </span>
        <span className="credentials__continue" onClick={handleSetCredentials}>
          Continue
        </span>
      </div>
    </Modal>
  );
};
