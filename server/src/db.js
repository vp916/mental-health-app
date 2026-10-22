import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const isLocal = /localhost|127\.0\.0\.1/.test(connectionString || "");

// Keep DATE columns as plain "2026-10-20" strings instead of JavaScript Date objects,
// so dates don't shift because of time zones. 1082 is PostgreSQL's id for the DATE type.
const DATE_TYPE = 1082;
pg.types.setTypeParser(DATE_TYPE, (value) => value);

// TIMESTAMP columns hold UTC time (the database runs in UTC), so read them as UTC
// instead of letting pg treat them as this computer's local time. 1114 is the TIMESTAMP type.
const TIMESTAMP_TYPE = 1114;
pg.types.setTypeParser(TIMESTAMP_TYPE, (value) => new Date(value.replace(" ", "T") + "Z"));

const pool = new pg.Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: true },
});

export const query = (text, params) => pool.query(text, params);

export default pool;
