import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, sparse: true })
  email?: string;

  @Prop({ unique: true, sparse: true })
  googleId?: string;

  @Prop({ type: String })
  password?: string;

  @Prop()
  name?: string;

  @Prop({ type: String, default: 'google', required: true })
  provider!: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
