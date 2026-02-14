/**
 * Check existing users in database
 */

import dotenv from 'dotenv';
import pkg from 'pg';

const { Client } = pkg;

dotenv.config();

async function checkUsers() {
  console.log('🔍 Checking users in database...\n');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    
    // Get all users
    const result = await client.query(`
      SELECT id, tenant_id, email, name, role, is_active 
      FROM emr.users 
      ORDER BY role, email
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No users found in database!');
      console.log('   Run: node scripts/load_test_data.js\n');
    } else {
      console.log(`✅ Found ${result.rows.length} users:\n`);
      
      result.rows.forEach(user => {
        const tenant = user.tenant_id || 'SUPERADMIN';
        const active = user.is_active ? '✓' : '✗';
        console.log(`   ${active} ${user.role.padEnd(15)} | ${user.email.padEnd(30)} | Tenant: ${tenant}`);
      });
      
      // Check for superadmin specifically
      const superadmin = result.rows.find(u => u.role === 'Superadmin');
      if (superadmin) {
        console.log('\n✅ Superadmin user exists:');
        console.log(`   Email: ${superadmin.email}`);
        console.log(`   Active: ${superadmin.is_active ? 'Yes' : 'No'}`);
      } else {
        console.log('\n❌ No Superadmin user found!');
      }
    }
    
    // Check password hash format
    const hashCheck = await client.query(`
      SELECT email, role, 
             CASE 
               WHEN password_hash LIKE '$2a$%' OR password_hash LIKE '$2b$%' THEN 'bcrypt ✓'
               ELSE 'NOT HASHED ✗'
             END as hash_type
      FROM emr.users 
      LIMIT 5
    `);
    
    console.log('\n🔐 Password Hash Check:');
    hashCheck.rows.forEach(u => {
      console.log(`   ${u.email.padEnd(30)} | ${u.hash_type}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();
