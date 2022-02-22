import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from './definitions/users.interface';

export type UserDocument = Document<Users>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: true,
  },
})
export class Users implements IUser {
  @Prop({
    required: [true, 'username is required'],
    unique: true,
    index: true,
  })
  username: string;

  @Prop({
    required: [true, 'email is required'],
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    required: [true, 'first_name is required'],
  })
  first_name: string;

  @Prop({
    required: [true, 'last_name is required'],
  })
  last_name: string;

  @Prop({
    required: false,
  })
  profile_pic_url?: string;

  @Prop({
    required: [true, 'password is required'],
  })
  password: string;

  @Prop({
    default: false,
  })
  is_active: boolean;

  @Prop({
    default: false,
  })
  is_verified: boolean;

  @Prop({
    default: false,
  })
  is_staff: boolean;

  @Prop({
    default: false,
  })
  is_superuser: boolean;
}

export const UserSchema = SchemaFactory.createForClass(Users);
