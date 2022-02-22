import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { UsersRedisRepository } from './definitions/user.redis.repository.abstract';

@Injectable()
export class UsersObjRedisRepository extends UsersRedisRepository {
  constructor(private redisSvc: RedisService) {
    super();
  }

  async save(
    key: string,
    value: any,
    ex: string,
    ttl: number,
  ): Promise<string | null> {
    const savedData = await this.redisSvc.getClient().set(key, value, ex, ttl);
    if (!savedData) return null;
    return 'OK';
  }

  async get(key: string): Promise<string | null> {
    return await this.redisSvc.getClient().get(key);
  }

  async delete(key: string): Promise<number | null> {
    return await this.redisSvc.getClient().del(key);
  }
}
