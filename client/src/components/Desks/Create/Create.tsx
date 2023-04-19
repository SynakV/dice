import { useRouter } from "next/router";
import useSWRMutation from "swr/mutation";
import React, { FC, useState } from "react";
import { postRequest } from "@utils/api/api";
import { TIMEOUT_TRANSITION } from "@utils/constants";
import { Modal } from "@components/Shared/Modal/Modal";
import { DesksModal } from "@components/Desks/utils/types";
import { DeskType, SettingsType } from "@utils/common/types";
import { getCredentials } from "@utils/helpers/storage/storage.helper";
import { Fields, isValid } from "@components/Shared/Settings/Fields/Fields";
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
    if (settings && isValid(settings, notification)) {
      const newDesk: DeskType = await trigger(
        {
          name: settings.name,
          wins: settings.wins,
          stages: settings.stages,
          players: settings.players,
          creator: {
            name: getCredentials().name,
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
        }, TIMEOUT_TRANSITION);
      } else {
        notification("Desk with such name already exists");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} title="Create new desk" className="create">
      <div className="create__main">
        <Fields isWithName setForm={setSettings} />
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
