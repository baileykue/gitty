const pool = require('../utils/pool');

module.exports = class Post {
  id;
  description;
  createdAt;
  userId;

  constructor(row) {
    this.id = row.id;
    this.description = row.description;
    this.createdAt = row.created_at;
    this.userId = row.user_id;
  }

  static async getAll() {
    return pool
      .query(
        `
            SELECT
            *
            FROM
            posts
            `
      )
      .then(({ rows }) => rows.map((row) => new Post(row)));
  }

  static async create({ description, id }) {
    const { rows } = await pool.query(
      `
    INSERT INTO
    posts (description, user_id)
    VALUES
    ($1, $2)
    RETURNING
    *
`,
      [description, id]
    );
    return new Post(rows[0]);
  }
};
