import Image from "next/image";
import { ASSETS } from "@utils/constants";
import { cacheAssets } from "@utils/helpers/common.helper";
import { Menu } from "@components/Shared/Layout/Menu/Menu";
import { Loading } from "@components/Shared/Loading/Loading";
import { CursorProvider } from "@utils/contexts/CursorProvider";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { NotificationProvider } from "@components/Shared/Notification/Notification";

interface Props {
  children: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => {
  // const [isShowChildren, setIsShowChildren] = useState(true);
  const [loading, setLoading] = useState<{
    percentage?: number;
    isLoaded: boolean;
  }>({ percentage: 0, isLoaded: false });

  // const router = useRouter();

  // useEffect(() => {
  //   const handleStart = (url: string) => {
  //     console.warn("CHANGE START!");
  //     return url !== router.asPath && setIsShowChildren(false);
  //   };

  //   const handleComplete = (url: string) => {
  //     console.warn("CHANGE END!");
  //     return url === router.asPath && setIsShowChildren(true);
  //   };

  //   // router.events.on("routeChangeStart", handleStart);
  //   // router.events.on("routeChangeComplete", handleComplete);
  //   // router.events.on("routeChangeError", handleComplete);

  //   return () => {
  //     // router.events.off("routeChangeStart", handleStart);
  //     // router.events.off("routeChangeComplete", handleComplete);
  //     // router.events.off("routeChangeError", handleComplete);
  //   };
  // });

  const loadAssets = async () => {
    // const assetsLength = Object.values(ASSETS).reduce(
    //   (acc, asset) => acc + asset.length,
    //   0
    // );
    // let loadedCount = 1;

    await cacheAssets(() => {
      // const percentage = (++loadedCount / assetsLength) * 100;
      // setLoading({
      //   percentage,
      //   isLoaded: percentage === 100,
      // });
    });

    setLoading({ isLoaded: true });
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // useEffect(() => {
  //   if (loading.isLoaded) {
  //     const video = document.getElementById("video") as HTMLVideoElement;

  //     if (video) {
  //       video.volume = 0.01;
  //     }
  //   }
  // }, [loading.isLoaded]);

  return (
    <CursorProvider>
      <NotificationProvider>
        <div className="layout">
          {loading.isLoaded ? (
            <>
              <div className="layout__background">
                <Image fill alt="striga" src="/images/striga.jpeg" />
                {/* <video autoPlay loop id="video">
                  <source src="/videos/video.mp4" type="video/mp4" />
                </video> */}
                <Image
                  fill
                  alt="grunge-square"
                  src="/images/grunge-square.png"
                />
                <Image fill alt="grunge-mess" src="/images/grunge-mess.webp" />
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
  );
};
