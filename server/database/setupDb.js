import dbPromise from './db.js';

async function setupDatabase() {
  const db = await dbPromise;

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      first_name TEXT,
      last_name TEXT
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
      image TEXT
    );
  `);

  // Create cart_items table
  await db.exec(`
    CREATE TABLE cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      size TEXT,
      custom_name TEXT,
      custom_number TEXT,
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

    // Create order_items table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        size TEXT,
        custom_name TEXT,
        custom_number TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);  

  // Create wishlist_items table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      size TEXT,
      custom_name TEXT,
      custom_number TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  console.log('Database setup complete.');

  await db.run(`
    INSERT INTO products (name, description, price, team, image)
    VALUES
      ('FC Barcelona Jersey', '2024 Home Kit', 499, 'FC Barcelona', './images/fcbarcelona.jpeg'),
      ('Real Madrid Jersey', '2024 Away Kit', 529, 'Real Madrid', './images/realmadrid.jpeg'),
      ('Manchester City Jersey', '2024 Third Kit', 479, 'Man City', './images/mancity.jpeg'),
      ('Arsenal Jersey', '2024 Home Kit', 459, 'Arsenal', './images/arsenal.jpeg')
  `);
  
  console.log('✅ Sample products inserted!');
}

setupDatabase();
