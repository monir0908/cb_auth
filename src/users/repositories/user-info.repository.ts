import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserInformation } from '../schemas/definitions/users.interface';
import {
  UserInformation,
  UserInformationDocument,
} from '../schemas/users-info.schema';
import { UserInfoRepository } from './definitions/users.repository.abstract';

@Injectable()
export class UserInfoObjRepository extends UserInfoRepository {
  constructor(
    @InjectModel(UserInformation.name)
    private model: Model<UserInformationDocument>,
  ) {
    super();
  }

  async createInfo(obj: IUserInformation): Promise<IUserInformation> {
    try {
      const info: UserInformationDocument = await this.model.create(obj);
      return <IUserInformation>info.toJSON();
    } catch (e) {
      Logger.error(e, 'CreateInfoRepo');
      return null;
    }
  }

  async getInfo(username: string): Promise<IUserInformation | null> {
    const info: UserInformationDocument = await this.model
      .findOne({
        username,
      })
      .exec();
    if (info === null) return null;
    return <IUserInformation>info.toJSON();
  }
}
