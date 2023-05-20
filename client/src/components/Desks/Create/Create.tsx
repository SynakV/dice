import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { postRequest } from "@utils/api/api";
import { TIMEOUT_TRANSITION } from "@utils/constants";
import { Modal } from "@components/Shared/Modal/Modal";
import { useCursor } from "@utils/contexts/CursorProvider";
import { DeskType, SettingsType } from "@utils/common/types";
import { Fields, isValid } from "@components/Shared/Settings/Fields/Fields";
import { useNotification } from "@components/Shared/Notification/Notification";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  setIsOpen: () => void;
}

export const Create: FC<Props> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const Cursor = useCursor();
  const { notification } = useNotification();

  const [settings, setSettings] = useState<SettingsType | null>(null);

  const handleCreateNewDesk = async () => {
    if (settings && isValid(settings, notification)) {
      const newDesk: DeskType & { message: string } = await postRequest(
        "desk",
        {
          name: settings.name,
          wins: settings.wins,
          stages: settings.stages,
          players: settings.players,
        }
      );

      if (newDesk._id) {
        setIsOpen();
        setTimeout(() => {
          router.push({
            pathname: "online/desk",
            query: {
              id: newDesk._id,
            },
          });
        }, TIMEOUT_TRANSITION);
      } else {
        notification(newDesk.message);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} title="Create new desk" className="create">
      <div className="create__main">
        <Fields isWithName setForm={setSettings} />
      </div>
      <div className="create__footer">
        <Cursor id="modal-create-desk-close" position="bottom" hint="Close">
          <Image
            width={30}
            height={30}
            alt="grunge-cross"
            onClick={setIsOpen}
            src="/images/grunge-cross.png"
          />
        </Cursor>
        <Cursor id="modal-create-desk-create" position="bottom" hint="Create">
          <Image
            width={30}
            height={30}
            alt="grunge-check-mark"
            onClick={handleCreateNewDesk}
            src="/images/grunge-check-mark.png"
          />
        </Cursor>
      </div>
    </Modal>
  );
};
