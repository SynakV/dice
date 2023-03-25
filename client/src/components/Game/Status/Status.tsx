import React from "react";
import { usePortal } from "@src/utils/hooks/usePortal";
import { useDesk } from "@src/utils/contexts/DeskContext";

export const Status = () => {
  const { desk } = useDesk();
  const portal = usePortal();

  const status = desk?.gameplay?.round?.status;

  return portal(
    <div className="status">{status ? status : 'Click "Roll dice"'}</div>
  );
};
