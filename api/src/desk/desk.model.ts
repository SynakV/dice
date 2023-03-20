import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeskDocument = Desk & Document;

interface Players {
  max?: number;
  players?: Player[];
}

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
  creator?: Player;

  @Prop({ type: Object })
  players?: Players;
}

export const DeskSchema = SchemaFactory.createForClass(Desk);
