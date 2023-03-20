import React, { useState } from "react";
import { OPPONENT } from "@src/utils/types";
import {
  getStorageItem,
  setStorageItem,
} from "@src/utils/helpers/storage/storage.helper";
import { STORAGE_ITEMS } from "@src/utils/helpers/storage/constants";
import { Credentials } from "@src/components/Selector/Credentials/Credentials";
import { CredentialsType } from "@src/components/Selector/Credentials/utils/types";
import { useRouter } from "next/router";

export const Selector = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedOpponent, setLocalSelectedOpponent] = useState<
    keyof typeof OPPONENT | null
  >(null);

  const handleSelectedOpponent = (selectedOpponent: keyof typeof OPPONENT) => {
    const credentials = getStorageItem(STORAGE_ITEMS.CREDENTIALS);

    if (!credentials) {
      setIsOpen(true);
      setLocalSelectedOpponent(selectedOpponent);
    } else {
      router.push(OPPONENT[selectedOpponent!].url);
    }
  };

  const handleSetCredentials = (credentials: CredentialsType) => {
    setIsOpen(false);
    router.push(OPPONENT[localSelectedOpponent!].url);
    setStorageItem(STORAGE_ITEMS.CREDENTIALS, JSON.stringify(credentials));
  };

  return (
    <>
      <div className="selector">
        <span className="selector__head-text">Select opponent</span>
        <div className="selector__selector">
          {Object.entries(OPPONENT).map(([key, { title }]) => (
            <span
              key={key}
              className="selector__option"
              onClick={() =>
                handleSelectedOpponent(key as keyof typeof OPPONENT)
              }
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
