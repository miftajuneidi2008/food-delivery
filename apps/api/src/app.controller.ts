import type { HealthCheckResponse } from '@food-delivery/types';
import { Controller, Get, Inject } from '@nestjs/common';
import type { Database } from './db/database';
import { users } from './db/schema/users';

@Controller()
export class AppController {
  constructor(@Inject('DB') private readonly db: Database) {}

  @Get('db-test')
  async dbTest() {
    const result = await this.db.select().from(users);
    return { users: result, count: result.length };
  }

  @Get('health')
  getHealth(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }
}
