import { usersService } from "../services/database/users.service";
import type { JwtToken } from "../types";
import bcrypt from "bcryptjs";

export const authController = {
  async register(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    await usersService.create(userId, email, hash);
    return { message: "Registrasi berhasil", userId };
  },

  async login(email: string, password: string, jwt: JwtToken) {
    const user = await usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error("Invalid credentials");
    }
    // Token berlaku 30 hari
    const expiresIn = 30 * 24 * 60 * 60; // 30 days in seconds
    const token = await jwt.sign({ 
      id: user.id, 
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + expiresIn
    });
    return { message: "Login berhasil", userId: user.id, token };
  },

  async refresh(userId: string, email: string, jwt: JwtToken) {
    // Perpanjang token dengan expiration baru
    const expiresIn = 30 * 24 * 60 * 60; // 30 days
    const token = await jwt.sign({ 
      id: userId, 
      email: email,
      exp: Math.floor(Date.now() / 1000) + expiresIn
    });
    return { token };
  },
};
