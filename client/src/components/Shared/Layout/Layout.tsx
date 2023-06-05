import Image from "next/image";
import { ASSETS } from "@utils/constants";
import { cacheAssets } from "@utils/helpers/common.helper";
import { Menu } from "@components/Shared/Layout/Menu/Menu";
import { Loading } from "@components/Shared/Loading/Loading";
import { MediaProvider } from "@utils/contexts/MediaProvider";
import { CursorProvider } from "@utils/contexts/CursorProvider";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { NotificationProvider } from "@components/Shared/Notification/Notification";

interface Props {
  children: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<{
    percentage?: number;
    isLoaded: boolean;
  }>({ percentage: 0, isLoaded: false });

  const loadAssets = async () => {
    // const assetsLength = Object.values(ASSETS).reduce(
    //   (acc, asset) => acc + asset.length,
    //   0
    // );
    // let loadedCount = 1;

    await cacheAssets();
    setLoading({ isLoaded: true });
  };

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <MediaProvider>
      <CursorProvider>
        <NotificationProvider>
          <div className="layout">
            {loading.isLoaded ? (
              <>
                <div className="layout__background">
                  <Image
                    fill
                    alt="grunge-square"
                    src="/images/grunge-square.png"
                  />
                  <Image
                    fill
                    alt="grunge-mess"
                    src="/images/grunge-mess.webp"
                  />
                </div>
                <div className="layout__content">{children}</div>
                <Menu />
              </>
            ) : (
              // <div className="layout__loading">
              //   <Image
              //     fill
              //     alt="grunge-loading"
              //     className="layout__loading-img--normal"
              //     src="/images/grunge-loading.png"
              //   />
              //   <div className="layout__loading-inverse">
              //     <Image
              //       fill
              //       alt="grunge-loading"
              //       src="/images/grunge-loading.png"
              //       className="layout__loading-img--inverted"
              //       style={{
              //         clipPath: `inset(0 ${100 - loading.percentage}% 0 0)`,
              //       }}
              //     />
              //   </div>
              // </div>
              <Loading />
            )}
          </div>
        </NotificationProvider>
      </CursorProvider>
    </MediaProvider>
  );
};
