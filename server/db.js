const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    location TEXT,
    profilePhoto TEXT,
    isOnline INTEGER
  )`);

  const seedUsers = [
    {
      name: 'Admin',
      email: 'admin@loveable.dev',
      password: 'Admin@123',
      role: 'admin',
      location: '',
      profilePhoto: '',
      isOnline: false,
    },
    {
      name: 'Priya',
      email: 'provider1@loveable.dev',
      password: 'Pass@123',
      role: 'provider',
      location: 'Hyderabad',
      profilePhoto: 'https://placehold.co/100x100?text=Priya',
      isOnline: true,
    },
    {
      name: 'Rahul',
      email: 'provider2@loveable.dev',
      password: 'Pass@123',
      role: 'provider',
      location: 'Mumbai',
      profilePhoto: 'https://placehold.co/100x100?text=Rahul',
      isOnline: true,
    },
    {
      name: 'Sneha',
      email: 'provider3@loveable.dev',
      password: 'Pass@123',
      role: 'provider',
      location: 'Delhi',
      profilePhoto: 'https://placehold.co/100x100?text=Sneha',
      isOnline: true,
    },
    {
      name: 'Aman',
      email: 'provider4@loveable.dev',
      password: 'Pass@123',
      role: 'provider',
      location: 'Pune',
      profilePhoto: 'https://placehold.co/100x100?text=Aman',
      isOnline: true,
    },
    {
      name: 'Riya',
      email: 'provider5@loveable.dev',
      password: 'Pass@123',
      role: 'provider',
      location: 'Bengaluru',
      profilePhoto: 'https://placehold.co/100x100?text=Riya',
      isOnline: true,
    },
    {
      name: 'Kiran',
      email: 'provider6@loveable.dev',
      password: 'Pass@123',
      role: 'provider',
      location: 'Hyderabad',
      profilePhoto: 'https://placehold.co/100x100?text=Kiran',
      isOnline: true,
    },
    {
      name: 'Deepak',
      email: 'provider7@loveable.dev',
      password: 'Pass@123',
      role: 'provider',
      location: 'Mumbai',
      profilePhoto: 'https://placehold.co/100x100?text=Deepak',
      isOnline: true,
    },
    {
      name: 'Neha',
      email: 'provider8@loveable.dev',
      password: 'Pass@123',
      role: 'provider',
      location: 'Delhi',
      profilePhoto: 'https://placehold.co/100x100?text=Neha',
      isOnline: true,
    },
    {
      name: 'Arjun',
      email: 'provider9@loveable.dev',
      password: 'Pass@123',
      role: 'provider',
      location: 'Pune',
      profilePhoto: 'https://placehold.co/100x100?text=Arjun',
      isOnline: true,
    },
    {
      name: 'Kavya',
      email: 'provider10@loveable.dev',
      password: 'Pass@123',
      role: 'provider',
      location: 'Bengaluru',
      profilePhoto: 'https://placehold.co/100x100?text=Kavya',
      isOnline: true,
    },
  ];

  seedUsers.forEach((u) => {
    db.get('SELECT 1 FROM users WHERE email = ?', [u.email], (err, row) => {
      if (err) return console.error('Seed check error:', err);
      if (!row) {
        const id = uuidv4();
        const hash = bcrypt.hashSync(u.password, 10);
        db.run(
          `INSERT INTO users (id, name, email, password, role, location, profilePhoto, isOnline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            u.name,
            u.email,
            hash,
            u.role,
            u.location,
            u.profilePhoto,
            u.isOnline ? 1 : 0,
          ],
          (err2) => {
            if (err2) console.error('Seed insert error:', err2);
          }
        );
      }
    });
  });
});

module.exports = db;
