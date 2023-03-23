import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PlayerType, PlayersType } from 'src/utils/common/types';

export type DeskDocument = Desk & Document;

@Schema({ timestamps: true })
export class Desk {
  @Prop()
  name?: string;

  @Prop()
  isGameStarted?: boolean;

  @Prop({ type: Object })
  creator?: PlayerType;

  @Prop({ type: Object })
  players?: PlayersType;
}

export const DeskSchema = SchemaFactory.createForClass(Desk);
