import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { Create } from "@components/Main/Desks/Create/Create";
import { DesksModal } from "@components/Main/Desks/utils/types";

interface Desk {
  name: string;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) =>
  fetch(`http://localhost:3001/${url}`).then((r) => r.json());

export const Desks = () => {
  const { data, error } = useSWR<Desk[]>("desk", fetcher);

  const [desks, setDesks] = useState<Desk[]>([]);

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
                <span className="list__join">Join</span>
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
