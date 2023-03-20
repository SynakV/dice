import { useRouter } from "next/router";
import { Menu } from "@components/Layout/Menu/Menu";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { NotificationProvider } from "@components/Notification/Notification";

interface Props {
  children: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => {
  const [isShowChildren, setIsShowChildren] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setIsShowChildren(false);
    const handleComplete = (url: string) =>
      url === router.asPath && setIsShowChildren(true);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return (
    <NotificationProvider>
      <div className="layout">
        <div className="layout__background" />
        {isShowChildren && <div className="layout__content">{children}</div>}
        <Menu />
      </div>
    </NotificationProvider>
  );
};
