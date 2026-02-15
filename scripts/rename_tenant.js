import 'dotenv/config';
import pool, { query } from '../server/db/connection.js';

async function run() {
    try {
        // Check Anita
        const anita = await query("SELECT id, name, email, tenant_id FROM emr.users WHERE email ILIKE '%anita%'");
        console.log('--- Dr. Anita ---');
        console.table(anita.rows);

        if (anita.rows.length > 0) {
            const tenantId = anita.rows[0].tenant_id;
            const tenant = await query("SELECT * FROM emr.tenants WHERE id = $1", [tenantId]);
            console.log('--- Anita Tenants ---');
            console.table(tenant.rows);
        }

        // Rename Tenant
        const update = await query("UPDATE emr.tenants SET name = 'Kidz Clinic' WHERE name = 'Selva Care Hospital' RETURNING *");
        console.log('--- Update Result ---');
        console.table(update.rows);

        if (update.rows.length === 0) {
            console.log('Tenant "Selva Care Hospital" not found (Maybe already renamed?)');
        }

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

run();
