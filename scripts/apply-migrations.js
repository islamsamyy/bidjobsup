#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wvkugrazpdpjvjnbsakb.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2a3VncmF6cGRwanZqbmJzYWtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzc3NzY1NywiZXhwIjoyMDQzMzQ1NjU3fQ.bw2wYBX3NTR6lEj5Qh9RV4fGvBk8I5K2mPqL9zX0w2Q';

const migrations = [
  {
    name: 'Add user columns',
    sql: `
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(500);
    `,
  },
  {
    name: 'Enhance jobs table',
    sql: `
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS job_type varchar(50) DEFAULT 'project' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'project')),
      ADD COLUMN IF NOT EXISTS experience_level varchar(50) DEFAULT 'mid' CHECK (experience_level IN ('entry', 'mid', 'senior')),
      ADD COLUMN IF NOT EXISTS required_skills text;
    `,
  },
  {
    name: 'Add admin features',
    sql: `
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT false;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('approved', 'pending', 'rejected'));
    `,
  },
  {
    name: 'Create indexes',
    sql: `
      CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
      CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_jobs_flagged ON jobs(flagged);
    `,
  },
];

async function runMigrations() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    console.log('🚀 Applying migrations to Supabase...\n');

    for (const migration of migrations) {
      console.log(`⏳ ${migration.name}...`);

      // Split by semicolon and filter empty statements
      const statements = migration.sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        const { error } = await supabase.rpc('exec', { sql: statement });

        if (error && !error.message?.includes('already exists')) {
          console.error(`❌ Error: ${error.message}`);
          throw error;
        }
      }

      console.log(`✅ ${migration.name} completed\n`);
    }

    console.log('✨ All migrations applied successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();
