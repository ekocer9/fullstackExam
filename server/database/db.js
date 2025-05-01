import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open the database connection
const dbPromise = open({
  filename: './database/database.db',
  driver: sqlite3.Database
});

export default dbPromise;
