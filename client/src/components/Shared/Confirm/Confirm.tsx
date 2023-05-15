import React, { FC } from "react";
import { Modal } from "@components/Shared/Modal/Modal";
import { useCursor } from "@utils/contexts/CursorProvider";

interface Props {
  ok: string;
  title: string;
  cancel: string;
  isOpen: boolean;
  onConfirm: (isConfirmed: boolean) => void;
}

export const Confirm: FC<Props> = ({
  ok,
  title,
  isOpen,
  cancel,
  onConfirm,
}) => {
  const Cursor = useCursor();

  return (
    <Modal isOpen={isOpen} title={title} className="confirm">
      <div className="confirm__buttons">
        <Cursor id="confirm-cancel" hint={cancel} position="bottom">
          <div className="confirm__button" onClick={() => onConfirm(false)}>
            {cancel}
          </div>
        </Cursor>
        <Cursor id="confirm-ok" hint={ok} position="bottom">
          <div className="confirm__button" onClick={() => onConfirm(true)}>
            {ok}
          </div>
        </Cursor>
      </div>
    </Modal>
  );
};

// TODO: There can be issue with Cursor id's when multiple Confirm components are open
