import Image from "next/image";
import { useRouter } from "next/router";
import { Menu } from "@components/Shared/Layout/Menu/Menu";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { NotificationProvider } from "@components/Shared/Notification/Notification";

interface Props {
  children: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => {
  const [isShowChildren, setIsShowChildren] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) => {
      console.warn("CHANGE START!");
      return url !== router.asPath && setIsShowChildren(false);
    };

    const handleComplete = (url: string) => {
      console.warn("CHANGE END!");
      return url === router.asPath && setIsShowChildren(true);
    };

    // router.events.on("routeChangeStart", handleStart);
    // router.events.on("routeChangeComplete", handleComplete);
    // router.events.on("routeChangeError", handleComplete);

    return () => {
      // router.events.off("routeChangeStart", handleStart);
      // router.events.off("routeChangeComplete", handleComplete);
      // router.events.off("routeChangeError", handleComplete);
    };
  });

  return (
    <NotificationProvider>
      <div className="layout">
        <div className="layout__background">
          <Image fill alt="striga" src="/images/striga.jpeg" />
          <Image fill alt="grunge-square" src="/images/grunge-square.png" />
          <Image fill alt="mess" src="/images/grunge-mess.webp" />
        </div>

        {isShowChildren && <div className="layout__content">{children}</div>}
        <Menu />
      </div>
    </NotificationProvider>
  );
};
