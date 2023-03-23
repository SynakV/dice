import { createPortal } from "react-dom";
import React, { FC, useEffect, useState } from "react";
import { useDesk } from "@src/utils/contexts/DeskContext";

export const Players: FC<any> = () => {
  const [isShow, setIsShow] = useState(false);

  const { desk } = useDesk();

  useEffect(() => {
    setIsShow(true);
  }, []);

  const max = desk?.players?.max;
  const players = desk?.players?.players;

  return isShow
    ? createPortal(
        <div className="players">
          <div className="players__list">
            {players?.length
              ? players.map((player, index) => (
                  <div key={index} className="players__player">
                    {player.name}
                  </div>
                ))
              : null}
          </div>
          <span className="players__counter">
            Players: {players?.length}/{max}
          </span>
          {/* {new Array(15).fill(null).map((_, index) => (
            <div key={index} className="players__player">
              {index}
            </div>
          ))} */}
        </div>,
        document.getElementsByTagName("body")[0]
      )
    : null;
};
