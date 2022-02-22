export abstract class UsersRedisRepository {
  abstract save(
    key: string,
    value: any,
    ex: string,
    ttl: number,
  ): Promise<string | null>;
  abstract get(key: string): Promise<string | null>;
  abstract delete(key: string): Promise<number | null>;
}
