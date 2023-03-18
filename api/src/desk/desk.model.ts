import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeskDocument = Desk & Document;

interface Player {
  name?: string;
  index?: number;
  cubes?: number[];
  isCreator?: boolean;
}

@Schema({ timestamps: true })
export class Desk {
  @Prop()
  id?: string;

  @Prop()
  name?: string;

  @Prop()
  index?: number;

  @Prop({ type: Object })
  players?: Player;
}

export const DeskSchema = SchemaFactory.createForClass(Desk);
