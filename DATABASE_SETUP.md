# Database Setup Guide

This application uses PostgreSQL to store conversation data. Follow these steps to set up the database:

## Prerequisites

1. **Install PostgreSQL** on your system:
   - macOS: `brew install postgresql`
   - Ubuntu/Debian: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Start PostgreSQL service**:
   - macOS: `brew services start postgresql`
   - Ubuntu/Debian: `sudo systemctl start postgresql`
   - Windows: Start from Services or use pgAdmin

## Database Setup

1. **Create a database**:
   ```bash
   createdb phone_call_automation
   ```

2. **Set environment variables**:
   Create a `.env.local` file in the project root:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/phone_call_automation
   ```
   
   Replace `username` and `password` with your PostgreSQL credentials.

3. **Install dependencies**:
   ```bash
   npm install pg @types/pg
   ```

4. **Initialize the database schema**:
   ```bash
   npm run setup-db
   ```

## Database Schema

The application creates a `conversations` table with the following structure:

```sql
CREATE TABLE conversations (
    call_id SERIAL PRIMARY KEY,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    patient_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    summary TEXT
);
```

## Troubleshooting

- **Connection refused**: Make sure PostgreSQL is running
- **Authentication failed**: Check your username/password in DATABASE_URL
- **Database doesn't exist**: Create the database first with `createdb phone_call_automation`

## Production Setup

For production deployment, use a managed PostgreSQL service like:
- AWS RDS
- Google Cloud SQL
- Heroku Postgres
- Supabase
- Railway

Update your `DATABASE_URL` environment variable with the production connection string.
