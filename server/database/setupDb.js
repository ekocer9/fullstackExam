import dbPromise from './db.js';

async function setupDatabase() {
  const db = await dbPromise;

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);

  // Create products table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER,
      team TEXT,
      playerName TEXT,
      image TEXT
    );
  `);

  // Create reviews table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_id INTEGER,
      rating INTEGER,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `);

  // Create cart_items table
  await db.exec(`
    CREATE TABLE cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      size TEXT, -- ✅ this is new
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  // Create orders table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_price INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Create wishlist_items table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_id INTEGER,
      size TEXT,
      UNIQUE(user_id, product_id, size),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `);


  console.log('Database setup complete.');

  await db.run(`
    INSERT INTO products (name, description, price, team, playerName)
    VALUES
      ('FC Barcelona Jersey', '2024 Home Kit', 499, 'FC Barcelona', 'Lewandowski'),
      ('Real Madrid Jersey', '2024 Away Kit', 529, 'Real Madrid', 'Vinícius Jr.'),
      ('Manchester City Jersey', '2024 Third Kit', 479, 'Man City', 'Haaland'),
      ('Arsenal Jersey', '2024 Home Kit', 459, 'Arsenal', 'Saka')
  `);
  
  console.log('✅ Sample products inserted!');
}

setupDatabase();
