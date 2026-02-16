
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  const result = await pool.query('SELECT name, email, role, password_hash FROM emr.users WHERE email IN ($1, $2, $3)', [
    'superadmin@emr.local',
    'anita@sch.local',
    'rajesh@sch.local'
  ]);

  console.log('User Hashes:');
  for (const user of result.rows) {
    const passwords = ['Admin@123', 'Anita@123', 'Rajesh@123'];
    let matched = 'NONE';
    for (const p of passwords) {
      if (await bcrypt.compare(p, user.password_hash)) {
        matched = p;
        break;
      }
    }
    console.log(`- ${user.name} (${user.email}): Hash starts with ${user.password_hash.substring(0, 10)}... Matches known: ${matched}`);
  }
  process.exit(0);
}

check();
