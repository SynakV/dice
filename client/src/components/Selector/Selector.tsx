import React, { useState } from "react";
import { MODE } from "@src/utils/constants";
import {
  getStorageItem,
  setStorageItem,
} from "@src/utils/helpers/storage/storage.helper";
import { useRouter } from "next/router";
import { STORAGE_ITEMS } from "@src/utils/helpers/storage/constants";
import { Credentials } from "@src/components/Selector/Credentials/Credentials";
import { CredentialsType } from "@src/components/Selector/Credentials/utils/types";

export const Selector = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedMode, setLocalSelectedMode] = useState<
    keyof typeof MODE | null
  >(null);

  const handleSelectedOpponent = (selectedOpponent: keyof typeof MODE) => {
    const credentials = getStorageItem(STORAGE_ITEMS.CREDENTIALS);

    if (!credentials) {
      setIsOpen(true);
      setLocalSelectedMode(selectedOpponent);
    } else {
      router.push(MODE[selectedOpponent!].url);
    }
  };

  const handleSetCredentials = (credentials: CredentialsType) => {
    setIsOpen(false);
    router.push(MODE[localSelectedMode!].url);
    setStorageItem(STORAGE_ITEMS.CREDENTIALS, JSON.stringify(credentials));
  };

  return (
    <>
      <div className="selector">
        <span className="selector__head-text">Select mode</span>
        <div className="selector__selector">
          {Object.entries(MODE).map(([key, { title }]) => (
            <span
              key={key}
              className="selector__option"
              onClick={() => handleSelectedOpponent(key as keyof typeof MODE)}
            >
              {title}
            </span>
          ))}
        </div>
      </div>
      <Credentials
        isOpen={isOpen}
        setCredentials={handleSetCredentials}
        toggleIsOpen={() => setIsOpen((prev) => !prev)}
      />
    </>
  );
};
