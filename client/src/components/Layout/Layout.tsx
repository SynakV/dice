import { Main } from "@components/Main/Main";
import { Menu } from "@components/Layout/Menu/Menu";
import { EVENTS, MESSAGES } from "../../utils/common/types";
import React, { FC, useContext, useEffect, useState } from "react";
import { WebsocketContext } from "@src/utils/contexts/WebsocketContext";

export const Layout: FC = () => {
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
    <div className="layout">
      <div className="layout__background" />
      <Menu />
      <Main />
    </div>
  );
};
