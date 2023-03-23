export const MESSAGES = {
  MESSAGE: 'message',
  GAME_START: 'gameStart',
  JOIN_DESK: 'joinDesk',
  LEAVE_DESK: 'leaveDesk',
} as const;

export const EVENTS = {
  CONNECTION: 'connection',
  ON_MESSAGE: 'onMessage',
  ON_GAME_START: 'onGameStart',
  ON_JOIN_DESK: 'onJoinDesk',
  ON_LEAVE_DESK: 'onLeaveDesk',
} as const;

export type PlayersType = {
  max?: number;
  players?: PlayerType[];
  sequence?: PlayerType[];
};

export type PlayerType = {
  id?: string;
  name?: string;
  cubes?: number[];
  isCreator?: boolean;
};

export type DeskType = {
  _id: string;
  name: string;
  creator: PlayerType;
  players: PlayersType;
};
