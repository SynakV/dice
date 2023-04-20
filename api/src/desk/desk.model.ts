import { Document } from 'mongoose';
import { GameplayType } from 'src/utils/common/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeskDocument = Desk & Document;

@Schema({ timestamps: true })
export class Desk {
  @Prop()
  name: string;

  @Prop({ type: Object })
  gameplay: GameplayType;
}

export const DeskSchema = SchemaFactory.createForClass(Desk);
