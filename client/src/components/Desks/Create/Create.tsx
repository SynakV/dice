import { useRouter } from "next/router";
import useSWRMutation from "swr/mutation";
import React, { FC, useReducer } from "react";
import { Modal } from "@components/Modal/Modal";
import { DesksModal } from "@src/components/Desks/utils/types";
import { STORAGE_ITEMS } from "@src/utils/helpers/storage/constants";
import { getStorageObjectItem } from "@src/utils/helpers/storage/storage.helper";
import { useNotification } from "@src/components/Notification/Notification";

interface Props {
  isOpen: boolean;
  setIsOpen: (key: DesksModal) => void;
}

interface Desk {
  name: string;
  players: number;
  creator?: {
    name: string;
  };
}

async function sendRequest(url: string, { arg }: { arg: Desk }) {
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
  const [desk, updateDesk] = useReducer(
    (prev: Desk, next: Partial<Desk>) => {
      return { ...prev, ...next };
    },
    { name: "", players: 2 }
  );

  const router = useRouter();
  const { notification } = useNotification();

  const { trigger, isMutating } = useSWRMutation("desk", sendRequest);

  const handleClose = () => {
    setIsOpen("create");
  };

  const handleCreateNewDesk = async () => {
    if (isValid()) {
      const newDesk = await trigger(
        {
          name: desk.name,
          players: desk.players,
          creator: {
            name: getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS).name,
          },
        },
        { revalidate: false }
      );

      if (newDesk.id) {
        handleClose();
        setTimeout(() => {
          router.push({
            pathname: "online/desk",
            query: {
              id: newDesk.id,
            },
          });
        }, 300);
      } else {
        notification("Desk with such name already exists");
      }
    }
  };

  const isValid = () => {
    return desk.name && desk.players! >= 2 && desk.players! <= 5;
  };

  return (
    <Modal isOpen={isOpen} title="Create new desk" className="create">
      <div className="create__main">
        <div className="create__field">
          <span className="create__name">Players:</span>
          <input
            type="number"
            min={2}
            max={5}
            value={desk.players}
            className="create__input"
            onChange={(e) => updateDesk({ players: +e.target.value })}
          />
        </div>
        <div className="create__field">
          <span className="create__name">Name:</span>
          <input
            type="text"
            value={desk.name}
            className="create__input"
            onChange={(e) => updateDesk({ name: e.target.value })}
          />
        </div>
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
