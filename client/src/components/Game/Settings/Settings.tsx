import { useRouter } from "next/router";
import React, { useState } from "react";
import { SettingsType } from "@utils/common/types";
import { useDesk } from "@utils/contexts/DeskContext";
import { Modal } from "@components/Shared/Modal/Modal";
import { Form } from "@components/Game/Settings/Form/Form";
import { Confirm } from "@components/Shared/Confirm/Confirm";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { afterSettingsChange } from "@utils/helpers/gameplay/gameplay.helper";

export const Settings = () => {
  const { replace } = useRouter();
  const { desk, setDesk } = useDesk();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const {
    gameOpen,
    isInitSettings,
    refreshGame,
    toggleGameOpen,
    setIsInitSettings,
  } = useGame();

  const isGameStarted = desk.gameplay.isGameStarted;

  const handleClose = () => {
    if (isInitSettings) {
      replace("/");
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
    if (isConfirmed && settings) {
      refreshGame();
      toggleGameOpen(GAME_OPEN.SETTINGS);
      setDesk((prev) => afterSettingsChange(prev, settings));
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
          <Form desk={desk} setForm={setSettings} />
        </div>
        <div className="settings__buttons">
          <div className="settings__button" onClick={handleClose}>
            Close
          </div>
          <div className="settings__button" onClick={handleApply}>
            {isInitSettings ? "Start" : "Apply"}
          </div>
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
