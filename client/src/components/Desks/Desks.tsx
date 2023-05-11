import Image from "next/image";
import { useRouter } from "next/router";
import { getRequest } from "@utils/api/api";
import { DeskType } from "@utils/common/types";
import { usePortal } from "@utils/hooks/usePortal";
import React, { useEffect, useState } from "react";
import { Loading } from "../Shared/Loading/Loading";
import { Create } from "@components/Desks/Create/Create";
import { useCursor } from "@utils/contexts/CursorProvider";
import { useNotification } from "@components/Shared/Notification/Notification";

export const Desks = () => {
  const hint = useCursor();
  const router = useRouter();
  const portal = usePortal();
  const { notification } = useNotification();

  const [isLoading, setIsLoading] = useState(false);
  const [desks, setDesks] = useState<DeskType[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setDesks(await getRequest<DeskType[]>("desk"));
      setIsLoading(false);
    })();
  }, []);

  const [isModalOpen, setIsMOdalOpen] = useState(false);

  const handleToggleOpenModal = () => {
    setIsMOdalOpen((prev) => !prev);
  };

  const handleJoin = (id?: string) => {
    router.push({
      pathname: "online/desk",
      query: {
        id,
      },
    });
  };

  const handleShare = (id?: string) => {
    notification("Coppied to clipboard");
    navigator.clipboard.writeText(`${window.origin}/online/desk?id=${id}`);
  };

  return (
    <>
      <div className="desks">
        {desks.length ? (
          <div className="desks__list">
            {desks.map((desk, index) => {
              const players = {
                max: desk.gameplay.max.players,
                current: desk.gameplay.players.length,
              };
              const isDisableToJoin =
                players.current === players.max || desk.gameplay.isGameStarted;
              return (
                <div
                  key={index}
                  className={`list__desk ${
                    isDisableToJoin ? "list__desk--disabled" : ""
                  }`}
                >
                  <Image
                    fill
                    alt="grunge-brush-stroke"
                    className="list__background"
                    src="/images/grunge-brush-stroke.png"
                    onClick={
                      isDisableToJoin ? () => {} : () => handleJoin(desk?._id)
                    }
                  />
                  <span className="list__title">{desk.name}</span>
                  <span className="list__players">
                    {players.current}/{players.max}
                  </span>
                  <span
                    className="list__share"
                    onClick={
                      isDisableToJoin ? () => {} : () => handleShare(desk?._id)
                    }
                  >
                    Share
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
        {isLoading && <Loading />}
        {!isLoading && !desks.length && (
          <Image
            width={200}
            height={180}
            alt="grunge-no-sign"
            className="desks__empty"
            src="/images/grunge-no-sign.png"
            // {...hint({
            //   text: "No desks",
            //   highlight: false,
            //   position: "top-left",
            // })}
          />
        )}
      </div>
      {portal(
        <Image
          width={50}
          height={50}
          alt="grunge-plus"
          className="desks__create"
          src="/images/grunge-plus.png"
          onClick={handleToggleOpenModal}
        />
      )}
      <Create isOpen={isModalOpen} setIsOpen={handleToggleOpenModal} />
    </>
  );
};
