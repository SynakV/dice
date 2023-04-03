import { useRouter } from "next/router";
import useSWRMutation from "swr/mutation";
import React, { FC, useState } from "react";
import { postRequest } from "@utils/api/api";
import { Modal } from "@components/Shared/Modal/Modal";
import { DesksModal } from "@components/Desks/utils/types";
import { Form } from "@components/Game/Settings/Form/Form";
import { DeskType, SettingsType } from "@utils/common/types";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { getStorageObjectItem } from "@utils/helpers/storage/storage.helper";
import { useNotification } from "@components/Shared/Notification/Notification";

interface Props {
  isOpen: boolean;
  setIsOpen: (key: DesksModal) => void;
}

export const Create: FC<Props> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const { notification } = useNotification();
  const { trigger } = useSWRMutation("desk", postRequest);
  const [settings, setSettings] = useState<SettingsType | null>(null);

  const handleClose = () => {
    setIsOpen("create");
  };

  const handleCreateNewDesk = async () => {
    if (isValid() && settings) {
      const newDesk: DeskType = await trigger(
        {
          name: settings.name,
          players: settings.players,
          creator: {
            name: getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS).name,
          },
        },
        { revalidate: false }
      );

      if (newDesk._id) {
        handleClose();
        setTimeout(() => {
          router.push({
            pathname: "online/desk",
            query: {
              id: newDesk._id,
            },
          });
        }, 300);
      } else {
        notification("Desk with such name already exists");
      }
    } else {
      notification("Invalid number of players");
    }
  };

  const isValid = () =>
    settings &&
    settings.name &&
    settings.players! >= 2 &&
    settings.players! <= 5;

  return (
    <Modal isOpen={isOpen} title="Create new desk" className="create">
      <div className="create__main">
        <Form setForm={setSettings} />
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
