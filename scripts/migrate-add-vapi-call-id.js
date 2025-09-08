import { Pool } from 'pg';

// Database migration script to add vapi_call_id column
async function migrateDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/phone_call_automation',
  });

  try {
    // Check if the column already exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'conversations' 
      AND column_name = 'vapi_call_id'
    `;
    
    const columnExists = await pool.query(checkColumnQuery);
    
    if (columnExists.rows.length === 0) {
      // Add the vapi_call_id column
      await pool.query(`
        ALTER TABLE conversations 
        ADD COLUMN vapi_call_id VARCHAR(255)
      `);
      
      console.log('✅ Added vapi_call_id column to conversations table');
      
      // Create index for faster lookups
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_conversations_vapi_call_id 
        ON conversations(vapi_call_id)
      `);
      
      console.log('✅ Created index on vapi_call_id column');
    } else {
      console.log('✅ vapi_call_id column already exists');
    }
    
    // Test the connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database migration completed successfully:', result.rows[0].now);
    
  } catch (error) {
    console.error('❌ Database migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateDatabase();
