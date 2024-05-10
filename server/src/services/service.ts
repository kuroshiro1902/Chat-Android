import pg from 'pg';
import { db } from '../database';

export default class Service {
  protected async query<T extends pg.QueryResultRow>(
    queryTextOrConfig: string | pg.QueryConfig<any[]>,
    values?: any[] | undefined,
  ) {
    return (await db.query<T>(queryTextOrConfig, values)).rows;
  }

  protected async queryOne<T extends pg.QueryResultRow>(
    queryTextOrConfig: string | pg.QueryConfig<any[]>,
    values?: any[] | undefined,
  ) {
    return (await db.query(queryTextOrConfig, values)).rows?.[0] as T | undefined;
  }
}
