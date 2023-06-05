import React from "react";
import Image from "next/image";
import { Modal } from "@components/Shared/Modal/Modal";
import { useMedia } from "@utils/contexts/MediaProvider";
import { useCursor } from "@utils/contexts/CursorProvider";

interface Props {
  isOpen: boolean;
  toggleIsOpen: () => void;
}

export const Media = ({ isOpen, toggleIsOpen }: Props) => {
  const Cursor = useCursor();
  const { volume, setVolume } = useMedia();

  const isToOff = volume > 0;

  const toggleVolume = () => {
    setVolume(isToOff ? 0 : 1);
  };

  return (
    <Modal className="media" isOpen={isOpen} title="Audio level">
      <div className="media__main">
        <div className="media__volume">
          <Cursor
            id="media-music"
            position="bottom"
            hint={isToOff ? "Off" : "On"}
          >
            <Image
              width={25}
              height={25}
              alt="grunge-music"
              onClick={toggleVolume}
              src="/images/grunge-music.png"
              className={`media__music media__music--${isToOff ? "on" : "off"}`}
            />
          </Cursor>

          <Image
            width={200}
            height={30}
            alt="grunge-loading"
            onClick={toggleIsOpen}
            className="media__audio--black"
            src="/images/grunge-loading.png"
          />
          <div
            className="media__audio--overlay"
            style={{ width: `${volume * 100}%` }}
          >
            <Image
              width={200}
              height={30}
              alt="grunge-loading"
              onClick={toggleIsOpen}
              className="media__audio--white"
              src="/images/grunge-loading.png"
            />
          </div>
          <div className="media__levels">
            {new Array(10).fill(null).map((_, index) => (
              <Cursor
                key={index}
                position="bottom"
                id={`level-${index}`}
                hint={`${(index + 1) * 10}%`}
              >
                <div onClick={() => setVolume((index + 1) / 10)} />
              </Cursor>
            ))}
          </div>
        </div>
      </div>
      <div className="media__buttons">
        <Cursor id="media-close" position="bottom" hint="Close">
          <Image
            width={30}
            height={30}
            alt="grunge-cross"
            onClick={toggleIsOpen}
            className="media__close"
            src="/images/grunge-cross.png"
          />
        </Cursor>
      </div>
    </Modal>
  );
};
