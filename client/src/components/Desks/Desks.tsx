import useSWR from "swr";
import { useRouter } from "next/router";
import { getRequest } from "@utils/api/api";
import { DeskType } from "@utils/common/types";
import React, { useEffect, useState } from "react";
import { Loading } from "../Shared/Loading/Loading";
import { Create } from "@components/Desks/Create/Create";
import { DesksModal } from "@components/Desks/utils/types";
import { useNotification } from "../Shared/Notification/Notification";

export const Desks = () => {
  const router = useRouter();
  const { notification } = useNotification();
  const { data, isLoading } = useSWR<DeskType[]>("desk", getRequest);

  const [desks, setDesks] = useState<DeskType[]>([]);

  useEffect(() => {
    if (data?.length) {
      setDesks(data);
    }
  }, [data]);

  const [isOpenModal, setIsOpenModal] = useState({
    create: false,
    join: false,
  });

  const handleOpenModal = (key: DesksModal) => {
    setIsOpenModal((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
          <span
            className="desks__create"
            onClick={() => handleOpenModal("create")}
          >
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
              const isFullOfPlayers = players.current === players.max;
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
                      isFullOfPlayers ? "list__join--disabled" : ""
                    }`}
                    onClick={
                      isFullOfPlayers ? () => {} : () => handleJoin(desk?._id)
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
      <Create isOpen={isOpenModal.create} setIsOpen={handleOpenModal} />
    </>
  );
};
