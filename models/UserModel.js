import db from '../config/db.js';


export const User = {
  create: async (user) => {
    const sql = 'INSERT INTO users (email, password, role, is_verified, city, name) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(sql, [user.email, user.password, user.role, false, user.city, user.name]);
    return result;
  },

  findByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows;
  },

  verifyUser: async (email) => {
    await db.execute('UPDATE users SET is_verified = ? WHERE email = ?', [true, email]);
  }
};