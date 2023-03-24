import React, {
  FC,
  useState,
  ReactNode,
  useContext,
  createContext,
} from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
}

interface INotification {
  notification: (text: string, delay?: number) => void;
}

const DEFAULT_VALUES = {
  notification: () => {},
};

type NotificationType = {
  key: string;
  text: string;
  isShow: boolean;
};

export const NotificationContext = createContext<INotification>(DEFAULT_VALUES);

export const NotificationProvider: FC<Props> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const notification = (text: string, delay: number = 3000) => {
    const key = Math.random().toString();
    setNotifications((prev) => [
      {
        key,
        text,
        isShow: true,
      },
    ]);
    setTimeout(() => {
      handleClose(key);
    }, delay);
  };

  const handleClose = (key: string) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification.key === key) {
          return {
            ...notification,
            isShow: false,
          };
        }
        return notification;
      })
    );

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.key !== key)
      );
    }, 300);
  };

  return (
    <NotificationContext.Provider
      value={{
        notification,
      }}
    >
      {children}
      {notifications.length
        ? createPortal(
            <div className="notifications">
              {notifications.map(({ key, text, isShow }) => (
                <div
                  key={key}
                  className={`notifications__notification ${
                    isShow ? "opened" : "closed"
                  }`}
                >
                  {text}
                  <span
                    onClick={() => handleClose(key)}
                    className="notifications__close"
                  />
                </div>
              ))}
            </div>,
            document.getElementsByTagName("body")[0]
          )
        : null}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
