import React, { FC } from "react";
import { Modal } from "@components/Shared/Modal/Modal";

interface Props {
  ok: string;
  title: string;
  cancel: string;
  isOpen: boolean;
  onConfirm: (isConfirmed: boolean) => void;
}

export const Confirm: FC<Props> = ({
  isOpen,
  title,
  cancel,
  ok,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} title={title} className="confirm">
      <div className="confirm__buttons">
        <div className="confirm__button" onClick={() => onConfirm(false)}>
          {cancel}
        </div>
        <div className="confirm__button" onClick={() => onConfirm(true)}>
          {ok}
        </div>
      </div>
    </Modal>
  );
};
