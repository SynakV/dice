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
          wins: settings.wins,
          stages: settings.stages,
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
    }
  };

  const isValid = () => {
    if (!settings) {
      return false;
    }

    if (!settings.name) {
      notification("Name is missing");
      return false;
    }

    if (!(settings.wins >= 2 && settings.wins <= 5)) {
      notification("Invalid number of wins");
      return false;
    }

    if (!(settings.stages >= 2 && settings.stages <= 5)) {
      notification("Invalid number of stages");
      return false;
    }

    if (!(settings.players >= 2 && settings.players <= 5)) {
      notification("Invalid number of players");
      return false;
    }

    return true;
  };

  return (
    <Modal isOpen={isOpen} title="Create new desk" className="create">
      <div className="create__main">
        <Form isWithName setForm={setSettings} />
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
