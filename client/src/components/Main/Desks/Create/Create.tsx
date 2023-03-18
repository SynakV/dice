import React, { FC, useRef } from "react";
import useSWRMutation from "swr/mutation";
import { Modal } from "@components/Modal/Modal";
import { DesksModal } from "@components/Main/Desks/utils/types";

interface Props {
  isOpen: boolean;
  setIsOpen: (key: DesksModal) => void;
}

async function sendRequest(url: string, { arg }: { arg: { name: string } }) {
  return fetch(`http://localhost:3001/${url}`, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export const Create: FC<Props> = ({ isOpen, setIsOpen }) => {
  const name = useRef<HTMLInputElement>(null);

  const { trigger, isMutating } = useSWRMutation("desk", sendRequest);

  const handleClose = () => {
    setIsOpen("create");
  };

  const handleCreateNewDesk = async () => {
    if (name.current?.value) {
      await trigger({ name: name.current?.value }, { revalidate: true });
      handleClose();
    }
  };

  return (
    <Modal isOpen={isOpen} title="Create new desk" className="create">
      <div className="create__main">
        <span className="create__name">Name:</span>
        <input type="text" ref={name} className="create__input" />
      </div>
      <div className="create__footer">
        <span className="create__close" onClick={handleClose}>
          Close
        </span>
        <span className="create__create" onClick={handleCreateNewDesk}>
          Create
        </span>
      </div>
    </Modal>
  );
};
