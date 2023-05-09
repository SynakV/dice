import Image from "next/image";
import React, { useEffect } from "react";

export const Cursor = () => {
  useEffect(() => {
    const cursor = document.getElementById("cursor");

    document.addEventListener("mousemove", (e) => {
      cursor?.setAttribute(
        "style",
        "top: " + (e.pageY + 10) + "px; left: " + (e.pageX + 10) + "px;"
      );
    });
  }, []);

  return (
    <div id="cursor">
      <Image
        width={50}
        height={50}
        alt="cursor"
        src="/images/grunge-cursor.png"
      />
    </div>
  );
};
