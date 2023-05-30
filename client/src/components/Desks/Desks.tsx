import Image from "next/image";
import { useRouter } from "next/router";
import { getRequest } from "@utils/api/api";
import { DeskType } from "@utils/common/types";
import { usePortal } from "@utils/hooks/usePortal";
import React, { useEffect, useState } from "react";
import { Loading } from "../Shared/Loading/Loading";
import { Create } from "@components/Desks/Create/Create";
import { FadeIn } from "@components/Shared/FadeIn/FadeIn";
import { useCursor } from "@utils/contexts/CursorProvider";
import { useNotification } from "@components/Shared/Notification/Notification";

export const Desks = () => {
  const Cursor = useCursor();
  const router = useRouter();
  const portal = usePortal();
  const { notification } = useNotification();

  const [isLoading, setIsLoading] = useState(false);
  const [desks, setDesks] = useState<DeskType[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const desks = await getRequest<DeskType[]>("desk");

      desks.sort((a, b) =>
        getIsDisabledDesk(a) === getIsDisabledDesk(b)
          ? 0
          : getIsDisabledDesk(a)
          ? 1
          : -1
      );

      setDesks(desks);
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

  const getIsDisabledDesk = (desk: DeskType) => {
    return (
      desk.gameplay.max.players === desk.gameplay.players.length ||
      desk.gameplay.isGameStarted
    );
  };

  return (
    <>
      <div className="desks">
        {desks.length ? (
          <FadeIn className="desks__list">
            {desks.map((desk, index) => {
              const isDisableToJoin = getIsDisabledDesk(desk);
              return (
                <div
                  key={index}
                  className={`list__desk ${
                    isDisableToJoin ? "list__desk--disabled" : ""
                  }`}
                >
                  <Cursor
                    hint="Join"
                    position="bottom"
                    isDisable={isDisableToJoin}
                    id={`desk-${desk?._id || Math.random()}`}
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
                  </Cursor>
                  <span className="list__title">{desk.name}</span>
                  <span className="list__players">
                    {desk.gameplay.players.length}/{desk.gameplay.max.players}
                  </span>
                  <Cursor
                    hint="Share"
                    position="bottom"
                    isDisable={isDisableToJoin}
                    id={`share-${desk?._id || Math.random()}`}
                  >
                    <span
                      className="list__share"
                      onClick={
                        isDisableToJoin
                          ? () => {}
                          : () => handleShare(desk?._id)
                      }
                    >
                      Share
                    </span>
                  </Cursor>
                </div>
              );
            })}
          </FadeIn>
        ) : null}
        {isLoading && (
          <FadeIn>
            <Loading />
          </FadeIn>
        )}
        {!isLoading && !desks.length && (
          <FadeIn>
            <Cursor hint="No desks" highlight={false} id="no-desks">
              <Image
                width={200}
                height={180}
                alt="grunge-no-sign"
                className="desks__empty"
                src="/images/grunge-no-sign.png"
              />
            </Cursor>
          </FadeIn>
        )}
      </div>
      {portal(
        <FadeIn>
          <Cursor id="create-new-desk" hint="Create new desk" position="top">
            <Image
              width={50}
              height={50}
              alt="grunge-plus"
              className="desks__create"
              src="/images/grunge-plus.png"
              onClick={handleToggleOpenModal}
            />
          </Cursor>
        </FadeIn>
      )}
      <Create isOpen={isModalOpen} setIsOpen={handleToggleOpenModal} />
    </>
  );
};
