import React, { FC, useState } from "react";
import { Form } from "@components/Shared/Form/Form";
import { CredentialsType } from "@utils/common/types";
import { Modal } from "@components/Shared/Modal/Modal";
import { useCursor } from "@utils/contexts/CursorProvider";
import { useNotification } from "@components/Shared/Notification/Notification";

interface Props {
  isOpen: boolean;
  toggleIsOpen: () => void;
  credentials: CredentialsType | null;
  setCredentials: (credentials: CredentialsType) => void;
}

export const Credentials: FC<Props> = ({
  isOpen,
  credentials,
  toggleIsOpen,
  setCredentials,
}) => {
  const [name, setName] = useState(credentials?.name || "");

  const Cursor = useCursor();
  const { notification } = useNotification();

  const handleSetCredentials = () => {
    if (name) {
      setCredentials({ name });
    } else {
      notification("Name should not be empty");
    }
  };

  return (
    <Modal isOpen={isOpen} title="Enter your name">
      <div className="credentials__main">
        <Form.Field label="Name">
          <Form.Input.Text value={name} setValue={setName} />
        </Form.Field>
      </div>
      <div className="credentials__footer">
        <Cursor id="credentials-close" hint="Close" position="bottom">
          <span className="credentials__close" onClick={toggleIsOpen}>
            Close
          </span>
        </Cursor>
        <Cursor id="credentials-continue" hint="Close" position="bottom">
          <span
            className="credentials__continue"
            onClick={handleSetCredentials}
          >
            Continue
          </span>
        </Cursor>
      </div>
    </Modal>
  );
};
