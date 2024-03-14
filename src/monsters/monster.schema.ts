import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MonsterDocument = HydratedDocument<Monster>;

@Schema({
  collection: 'monsters',
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (_doc: any, ret: any) => {
      return ret;
    },
  },
})
export class Monster {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  attack: number;

  @Prop({ required: true })
  defense: number;

  @Prop({ required: true })
  hp: number;

  @Prop({ required: true })
  speed: number;

  @Prop({ required: false })
  imageUrl: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  typeCode: string;

  @Prop({ required: true })
  incubationTime: number;

  @Prop({ required: true })
  status: string;
}

export const MonsterSchema = SchemaFactory.createForClass(Monster);
