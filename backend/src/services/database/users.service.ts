import db from "../../config/database";
import type { User } from "../../types";

export const usersService = {
  findByEmail(email: string): User | null {
    return db
      .query("SELECT * FROM users WHERE email = $email")
      .get({ $email: email }) as User | null;
  },

  findById(id: string): User | null {
    return db
      .query("SELECT * FROM users WHERE id = $id")
      .get({ $id: id }) as User | null;
  },

  create(id: string, email: string, passwordHash: string): void {
    db.query(
      "INSERT INTO users (id, email, password_hash) VALUES ($id, $email, $hash)"
    ).run({ $id: id, $email: email, $hash: passwordHash });
  },

  updateLastActive(id: string): void {
    db.query(
      "UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $id"
    ).run({ $id: id });
  },
};
