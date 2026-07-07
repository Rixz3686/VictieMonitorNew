import db from "../../config/database";
import type { User } from "../../types";

export const usersService = {
  async findByEmail(email: string): Promise<User | null> {
    return (await db
      .query("SELECT * FROM users WHERE email = $email")
      .get({ $email: email })) as User | null;
  },

  async findById(id: string): Promise<User | null> {
    return (await db
      .query("SELECT * FROM users WHERE id = $id")
      .get({ $id: id })) as User | null;
  },

  async create(id: string, email: string, passwordHash: string): Promise<void> {
    await db.query(
      "INSERT INTO users (id, email, password_hash) VALUES ($id, $email, $hash)"
    ).run({ $id: id, $email: email, $hash: passwordHash });
  },

  async updateLastActive(id: string): Promise<void> {
    await db.query(
      "UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $id"
    ).run({ $id: id });
  },
};
