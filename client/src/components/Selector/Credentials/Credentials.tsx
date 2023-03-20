import React, { FC, useRef } from "react";
import { Modal } from "@components/Modal/Modal";
import { CredentialsType } from "@src/components/Selector/Credentials/utils/types";

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

  const handleSetCredentials = () => {
    const value = name.current?.value;

    if (value) {
      setCredentials({ name: value });
    }
  };

  return (
    <Modal isOpen={isOpen} title="Enter your name">
      <div className="credentials__main">
        <span className="credentials__name">Name:</span>
        <input type="text" ref={name} className="credentials__input" />
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
