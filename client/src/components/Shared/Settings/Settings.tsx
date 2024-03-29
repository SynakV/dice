import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SettingsType } from "@utils/common/types";
import { useDesk } from "@utils/contexts/DeskContext";
import { Modal } from "@components/Shared/Modal/Modal";
import { useCursor } from "@utils/contexts/CursorProvider";
import { Confirm } from "@components/Shared/Confirm/Confirm";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { Fields, isValid } from "@components/Shared/Settings/Fields/Fields";
import { useNotification } from "@components/Shared/Notification/Notification";

export const Settings = () => {
  const Cursor = useCursor();
  const { back } = useRouter();
  const { handle, desk } = useDesk();
  const { notification } = useNotification();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const {
    isOnline,
    gameOpen,
    isInitSettings,
    toggleGameOpen,
    setIsInitSettings,
  } = useGame();

  const isGameStarted = desk.gameplay.isGameStarted;

  const handleClose = () => {
    if (isInitSettings && !isOnline) {
      back();
    } else {
      toggleGameOpen(GAME_OPEN.SETTINGS);
    }
  };

  const handleApply = () => {
    if (!isGameStarted) {
      handleConfirm(true);
    } else {
      setIsConfirmOpen(true);
    }
    setIsInitSettings(false);
  };

  const handleConfirm = (isConfirmed: boolean) => {
    if (isConfirmed && settings && isValid(settings, notification)) {
      if (desk.gameplay.isGameStarted && !isOnline) {
        handle.endGame();
      }
      handle.changeSettings(settings);
      toggleGameOpen(GAME_OPEN.SETTINGS);
    }
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Modal
        title="Settings"
        className="settings"
        isOpen={gameOpen[GAME_OPEN.SETTINGS]}
      >
        <div className="settings__main">
          <Fields desk={desk} setForm={setSettings} />
        </div>
        <div className="settings__buttons">
          <Cursor id="settings-close" hint="Close" position="bottom">
            <Image
              width={30}
              height={30}
              alt="grunge-cross"
              onClick={handleClose}
              src="/images/grunge-cross.png"
            />
          </Cursor>
          <Cursor id="settings-apply" hint="Apply" position="bottom">
            <Image
              width={30}
              height={30}
              onClick={handleApply}
              alt="grunge-check-mark"
              src="/images/grunge-check-mark.png"
            />
          </Cursor>
        </div>
      </Modal>
      <Confirm
        ok="Yes"
        cancel="No"
        isOpen={isConfirmOpen}
        onConfirm={handleConfirm}
        title="Game will be reset. Do you want to apply changes?"
      />
    </>
  );
};
