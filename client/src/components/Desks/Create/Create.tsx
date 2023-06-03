import Image from "next/image";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { postRequest } from "@utils/api/api";
import { Modal } from "@components/Shared/Modal/Modal";
import { useCursor } from "@utils/contexts/CursorProvider";
import { DeskType, SettingsType } from "@utils/common/types";
import { Fields, isValid } from "@components/Shared/Settings/Fields/Fields";
import { useNotification } from "@components/Shared/Notification/Notification";

interface Props {
  isOpen: boolean;
  setIsOpen: () => void;
}

export const Create: FC<Props> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const Cursor = useCursor();
  const { notification } = useNotification();

  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsType | null>(null);

  const handleCreateNewDesk = async () => {
    if (settings && isValid(settings, notification)) {
      setIsLoading(true);

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
        router.push({
          pathname: "online/desk",
          query: {
            id: newDesk._id,
          },
        });
      } else {
        notification(newDesk.message);
      }

      setIsLoading(false);
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
        <Cursor
          highlight={!isLoading}
          id="modal-create-desk-create"
          hint={isLoading ? "Loading..." : "Create"}
          position={isLoading ? "default" : "bottom"}
        >
          <Image
            width={30}
            height={30}
            alt="grunge-check-mark"
            onClick={isLoading ? () => {} : () => handleCreateNewDesk()}
            src="/images/grunge-check-mark.png"
            className={`footer__create ${
              isLoading ? "footer__create--disabled" : ""
            }`}
            style={{
              animation: isLoading ? "flickerAnimation 0.8s infinite" : "",
            }}
          />
        </Cursor>
      </div>
    </Modal>
  );
};
