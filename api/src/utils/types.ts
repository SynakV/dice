export type Timers = {
  [roomId: string]: {
    STAGE_FINISH: NodeJS.Timer;
    CONCLUSION_CLOSE: NodeJS.Timer;
  };
};
