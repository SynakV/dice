import { Document, Types } from 'mongoose';
import { Desk } from 'src/desk/desk.model';

export type Timers = {
  [roomId: string]: {
    STAGE_FINISH: NodeJS.Timer;
    CONCLUSION_CLOSE: NodeJS.Timer;
  };
};

export type ErrorType = {
  error: string;
};

export type DocumentDeskType = Document<unknown, any, Desk> &
  Omit<
    Desk & {
      _id: Types.ObjectId;
    },
    never
  >;
