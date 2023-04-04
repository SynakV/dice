import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PlayerType, GameplayType } from 'src/utils/common/types';

export type DeskDocument = Desk & Document;

@Schema({ timestamps: true })
export class Desk {
  @Prop()
  name: string;

  @Prop({ type: Object })
  creator: PlayerType;

  @Prop({ type: Object })
  gameplay: GameplayType;
}

export const DeskSchema = SchemaFactory.createForClass(Desk);
