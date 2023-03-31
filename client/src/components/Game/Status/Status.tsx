import React from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";

export const Status = () => {
  const { desk } = useDesk();
  const portal = usePortal();

  const status = desk.gameplay.status.text;

  return portal(
    <div className="status">{status ? status : 'Click "Roll dice"'}</div>
  );
};
