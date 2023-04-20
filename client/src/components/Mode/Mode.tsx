import React, { useState } from "react";
import { MODE } from "@utils/constants";
import {
  getStorageItem,
  setStorageItem,
} from "@utils/helpers/storage/storage.helper";
import { useRouter } from "next/router";
import { CredentialsType } from "@utils/common/types";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { Credentials } from "@components/Shared/Credentials/Credentials";

export const Mode = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [localMode, setLocalMode] = useState<keyof typeof MODE | null>(null);

  const handleMode = (mode: keyof typeof MODE) => {
    const credentials = getStorageItem(STORAGE_ITEMS.CREDENTIALS);

    if (!credentials) {
      setIsOpen(true);
      setLocalMode(mode);
    } else {
      router.push(MODE[mode!].url);
    }
  };

  const handleSetCredentials = (credentials: CredentialsType) => {
    setIsOpen(false);
    router.push(MODE[localMode!].url);
    setStorageItem(STORAGE_ITEMS.CREDENTIALS, JSON.stringify(credentials));
  };

  return (
    <>
      <div className="mode">
        <span className="mode__head-text">Select mode</span>
        <div className="mode__selector">
          {Object.entries(MODE).map(([key, { title }]) => (
            <span
              key={key}
              className="mode__option"
              onClick={() => handleMode(key as keyof typeof MODE)}
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
