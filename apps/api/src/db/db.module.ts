import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { relations } from './relations';

@Global()
@Module({
  providers: [
    {
      provide: 'DB',
      useFactory: () => {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL!,
        });
        return drizzle({ client: pool, relations });
      },
    },
  ],
  exports: ['DB'],
})
export class DbModule {}
