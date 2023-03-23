import useSWR from "swr";
import { useRouter } from "next/router";
import { getRequest } from "@src/utils/api/api";
import React, { useEffect, useState } from "react";
import { DeskType } from "@src/utils/common/types";
import { Create } from "@src/components/Desks/Create/Create";
import { DesksModal } from "@src/components/Desks/utils/types";

export const Desks = () => {
  const router = useRouter();
  const { data } = useSWR<DeskType[]>("desk", getRequest);

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
            {desks.map((desk, index) => (
              <div key={index} className="list__desk">
                <span className="list__title">{desk.name}</span>
                <span className="list__players">
                  Players: {desk.players?.players?.length}/{desk?.players?.max}
                </span>
                <span
                  className="list__join"
                  onClick={() => handleJoin(desk?._id)}
                >
                  Join
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="desks__empty">No desks</span>
        )}
      </div>
      <Create isOpen={isOpenModal.create} setIsOpen={handleOpenModal} />
    </>
  );
};
