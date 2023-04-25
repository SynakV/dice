import React from "react";
import Link from "next/link";
import { MODE } from "@utils/constants";

export const Mode = () => (
  <div className="mode">
    <span className="mode__head-text">Select mode</span>
    <div className="mode__selector">
      {Object.entries(MODE).map(([key, { title, url }]) => (
        <Link href={url}>
          <span key={key} className="mode__option">
            {title}
          </span>
        </Link>
      ))}
    </div>
  </div>
);
