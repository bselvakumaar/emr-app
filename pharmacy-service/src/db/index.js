/**
 * Database Connection Pool - MedFlow EMR
 * PostgreSQL connection pool configuration
 */

import pkg from 'pg';
const { Pool } = pkg;

// Database connection configuration
const pool = new Pool({
  // Use DATABASE_URL from environment or construct from individual params
  connectionString: process.env.DATABASE_URL,
  
  // SSL configuration for Neon (required)
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  
  // Pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔌 Shutting down database pool...');
  await pool.end();
  process.exit(0);
});

export { pool };
export default pool;
