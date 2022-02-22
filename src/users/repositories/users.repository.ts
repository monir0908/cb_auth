import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPagination, IUser } from '../schemas/definitions/users.interface';
import { UserDocument, Users } from '../schemas/users.schema';
import { UsersRepository } from './definitions/users.repository.abstract';

@Injectable()
export class UsersObjRepository extends UsersRepository {
  constructor(@InjectModel(Users.name) private model: Model<UserDocument>) {
    super();
  }

  async create_user(obj: IUser): Promise<IUser | null> {
    try {
      const user: UserDocument = await this.model.create(obj);
      return <IUser>user.toJSON();
    } catch (e) {
      Logger.log(e, 'CreateUserRepo');
      return null;
    }
  }

  async get_user_with_email(
    username: string,
    email: string,
  ): Promise<IUser | null> {
    const user: UserDocument = await this.model
      .findOne(
        { $or: [{ username }, { email }] },
        {
          __v: 0,
          updatedAt: 0,
          _id: 0,
        },
      )
      .exec();
    if (user === null) return null;
    return <IUser>user.toJSON();
  }

  async get_user(username: string): Promise<IUser | null> {
    const user: UserDocument = await this.model
      .findOne(
        { username: username },
        {
          __v: 0,
          updatedAt: 0,
          _id: 0,
        },
      )
      .exec();
    if (!user) return null;
    return <IUser>user.toJSON();
  }

  async update_user(obj: any, username: string): Promise<IUser | null> {
    const user: UserDocument = await this.model.findOneAndUpdate(
      { username },
      {
        $set: obj,
      },
      {
        new: true,
        projection: {
          __v: 0,
          updatedAt: 0,
          password: 0,
          _id: 0,
        },
      },
    );
    if (!user) return null;
    return <IUser>user.toJSON();
  }

  async get_users(
    filters: IPagination,
    page: number,
    pageSize: number,
  ): Promise<any> {
    delete filters.page;
    delete filters.page_size;
    const data: UserDocument[] = await this.model
      .find(
        { ...filters },
        {
          __v: 0,
          id: 0,
          password: 0,
        },
      )
      .skip(page)
      .limit(pageSize);
    return data;
  }

  async count(querySpec: IPagination): Promise<number> {
    const count: number = await this.model.countDocuments(querySpec);
    return count;
  }
}
