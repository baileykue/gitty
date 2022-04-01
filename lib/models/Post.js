const pool = require('../utils/pool');

module.exports = class Post {
  id;
  description;
  created_at;
  user_id;

  constructor(row) {
    this.id = row.id;
    this.description = row.description;
    this.created_at = row.created_at;
    this.user_id = row.user_id;
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
            SELECT
            *
            FROM
            posts
            `
    );
    return rows.map((row) => new Post(row));
  }
};
