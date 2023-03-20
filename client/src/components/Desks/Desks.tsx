import useSWR from "swr";
import { useRouter } from "next/router";
import { EVENTS, MESSAGES } from "../../utils/common/types";
import { Create } from "@src/components/Desks/Create/Create";
import { DesksModal } from "@src/components/Desks/utils/types";
import React, { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "@src/utils/contexts/WebsocketContext";

interface Desk {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) =>
  fetch(`http://localhost:3001/${url}`).then((r) => r.json());

export const Desks = () => {
  const router = useRouter();
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

  const handleJoin = (id: string) => {
    router.push({
      pathname: "online/desk",
      query: {
        id,
      },
    });
  };

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on(EVENTS.CONNECTION, () => {
      console.log("Connected!");
    });
    socket.on(EVENTS.ON_MESSAGE, (data: any) => {
      console.log("onMessage event received!");
      console.log(data);
      setMessages((prev) => [...prev, data.content]);
    });
    socket.on("", () => {});

    return () => {
      console.log("Unregistering events...");
      socket.off(EVENTS.CONNECTION);
      socket.off(EVENTS.ON_MESSAGE);
    };
  }, []);

  const handleSubmit = () => {
    if (input) {
      socket.emit(MESSAGES.NEW_MESSAGE, input);
      setInput("");
    }
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
                <span
                  className="list__join"
                  onClick={() => handleJoin(desk._id)}
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
