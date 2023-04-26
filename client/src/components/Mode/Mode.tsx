import React from "react";
import Link from "next/link";
import { MODE } from "@utils/constants";

export const Mode = () => (
  <div className="mode">
    <span className="mode__head-text">Select mode</span>
    <div className="mode__selector">
      {Object.entries(MODE).map(([key, { title, url }]) => (
        <Link className="mode__option" key={key} href={url}>
          {title}
        </Link>
      ))}
    </div>
  </div>
);
