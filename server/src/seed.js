/**
 * Creates the first System Administrator account so you have a way to log in
 * before any admin exists. Run with: npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    console.log(`Admin with email ${email} already exists. Skipping.`);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@1234', 10);
  await User.create({
    name: process.env.ADMIN_NAME || 'Default Platform Administrator',
    email,
    password: hashed,
    address: process.env.ADMIN_ADDRESS || 'Head Office',
    role: 'ADMIN',
  });

  console.log(`Admin account created: ${email} / ${process.env.ADMIN_PASSWORD || 'Admin@1234'}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
