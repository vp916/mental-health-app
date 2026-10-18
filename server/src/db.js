import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

// Hosted databases (Neon, Supabase, Render) need SSL; local Postgres doesn't.
const isLocal = /localhost|127\.0\.0\.1/.test(connectionString || "");

const pool = new pg.Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

// Usage in a route:  const { rows } = await query("SELECT * FROM users WHERE id = $1", [id]);
export const query = (text, params) => pool.query(text, params);

export default pool;
