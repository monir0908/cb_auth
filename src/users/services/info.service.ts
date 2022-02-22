import { ConflictException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProfileDto } from '../dtos/users.dto';
import { ApproveStatusEnum } from '../enum/user.enum';
import { UserInfoRepository } from '../repositories/definitions/users.repository.abstract';
import { IUserInformation } from '../schemas/definitions/users.interface';

@Injectable()
export class InfoService {
  constructor(
    private readonly infoRepo: UserInfoRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async createInfo(obj: CreateProfileDto, username: string): Promise<any> {
    const approved = ApproveStatusEnum.INACTIVE;
    const infoObj: IUserInformation = { ...obj, username, approved };
    const existingInfo = await this.infoRepo.getInfo(username);
    if (existingInfo) {
      throw new ConflictException({
        success: false,
        message: 'user info already created',
      });
    }
    const createInfo = await this.infoRepo.createInfo(infoObj);
    return createInfo;
  }

  async getInfo(username: string): Promise<any> {
    const existingInfo = await this.infoRepo.getInfo(username);
    if (!existingInfo) {
      throw new ConflictException({
        success: false,
        message: 'user info already created',
      });
    }
    return existingInfo;
  }
}
