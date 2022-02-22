import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApproveStatusEnum } from '../enum/user.enum';
import { IUserInformation } from './definitions/users.interface';

export type UserInformationDocument = Document<UserInformation>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: true,
  },
})
export class UserInformation implements IUserInformation {
  @Prop({
    required: [true, 'username is required'],
    unique: true,
    index: true,
  })
  username: string;

  @Prop({
    required: [true, 'company_name is required'],
  })
  company_name: string;

  @Prop({
    required: [true, 'address is required'],
  })
  address: string;

  @Prop({
    required: false,
  })
  bin?: string;

  @Prop({
    required: false,
  })
  bin_no?: string;

  @Prop({
    required: false,
  })
  tin?: string;

  @Prop({
    required: false,
  })
  tin_no?: string;

  @Prop({
    required: false,
  })
  trade_licence?: string;

  @Prop({
    required: false,
  })
  trade_licence_no?: string;

  @Prop({
    required: true,
    default: ApproveStatusEnum.INACTIVE,
    type: String,
    enum: ApproveStatusEnum,
    index: true,
  })
  approved: ApproveStatusEnum;
}

export const UserInformationSchema =
  SchemaFactory.createForClass(UserInformation);
