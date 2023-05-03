import { useRouter } from "next/router";
import { getRequest } from "@utils/api/api";
import { DeskType } from "@utils/common/types";
import React, { useEffect, useState } from "react";
import { Loading } from "../Shared/Loading/Loading";
import { Create } from "@components/Desks/Create/Create";
import { useNotification } from "@components/Shared/Notification/Notification";

export const Desks = () => {
  const router = useRouter();
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
        <div className="desks__header">
          <span className="desks__title">Desks</span>
          <span className="desks__create" onClick={handleToggleOpenModal}>
            Create desk
          </span>
        </div>
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
                <div key={index} className="list__desk">
                  <span className="list__title">{desk.name}</span>
                  <span className="list__players">
                    {players.current}/{players.max}
                  </span>
                  <span
                    className="list__share"
                    onClick={() => handleShare(desk?._id)}
                  >
                    Share
                  </span>
                  <span
                    className={`list__join ${
                      isDisableToJoin ? "list__join--disabled" : ""
                    }`}
                    onClick={
                      isDisableToJoin ? () => {} : () => handleJoin(desk?._id)
                    }
                  >
                    Join
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
        {isLoading && <Loading />}
        {!isLoading && !desks.length && (
          <span className="desks__empty">No desks</span>
        )}
      </div>
      <Create isOpen={isModalOpen} setIsOpen={handleToggleOpenModal} />
    </>
  );
};
