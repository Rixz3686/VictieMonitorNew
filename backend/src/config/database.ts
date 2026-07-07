import { env } from "cloudflare:workers";

function parseNamedParams(sql: string, params?: Record<string, any>) {
  if (!params) return { sql, bindings: [] };
  const paramNames: string[] = [];
  const parsedSql = sql.replace(/\$[a-zA-Z0-9_]+/g, (match) => {
    paramNames.push(match);
    return "?";
  });
  const bindings = paramNames.map((name) => {
    const val = params[name];
    return val !== undefined ? val : null;
  });
  return { sql: parsedSql, bindings };
}

export const db = {
  query<TReturn = any, TParams extends Record<string, any> = Record<string, any>>(sql: string) {
    return {
      async get(params?: TParams): Promise<TReturn | null> {
        const { sql: parsedSql, bindings } = parseNamedParams(sql, params);
        const dbInstance = (env as any).DB as D1Database;
        return dbInstance.prepare(parsedSql).bind(...bindings).first() as Promise<TReturn | null>;
      },
      async all(params?: TParams): Promise<TReturn[]> {
        const { sql: parsedSql, bindings } = parseNamedParams(sql, params);
        const dbInstance = (env as any).DB as D1Database;
        const { results } = await dbInstance.prepare(parsedSql).bind(...bindings).all();
        return results as TReturn[];
      },
      async run(params?: TParams): Promise<any> {
        const { sql: parsedSql, bindings } = parseNamedParams(sql, params);
        const dbInstance = (env as any).DB as D1Database;
        return dbInstance.prepare(parsedSql).bind(...bindings).run();
      },
      raw(params?: TParams) {
        const { sql: parsedSql, bindings } = parseNamedParams(sql, params);
        const dbInstance = (env as any).DB as D1Database;
        return dbInstance.prepare(parsedSql).bind(...bindings);
      }
    };
  },
  async batch(statements: any[]) {
    const dbInstance = (env as any).DB as D1Database;
    return dbInstance.batch(statements);
  },
  async exec(sql: string) {
    const dbInstance = (env as any).DB as D1Database;
    return dbInstance.exec(sql);
  }
};

export default db;
