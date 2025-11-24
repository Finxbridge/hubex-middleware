# Database Setup Guide

## Overview

Hubex uses PostgreSQL with TypeORM for database management. This guide covers database setup, migrations, and troubleshooting.

## Prerequisites

- PostgreSQL 13+ installed locally OR access to a remote PostgreSQL instance
- Database credentials configured in `.env` file

## Configuration

### Environment Variables

Ensure these variables are set in your `.env` file:

```env
# Database Configuration
DATABASE_HOST=localhost                    # Your database host
DATABASE_PORT=5432                         # PostgreSQL port (default: 5432)
DATABASE_USER=hubex_user                   # Database username
DATABASE_PASSWORD=your_password            # Database password
DATABASE_NAME=hubex                        # Database name
DATABASE_SYNCHRONIZE=false                 # Auto-sync schema (use ONLY in development)
DATABASE_LOGGING=true                      # Enable SQL query logging
DATABASE_SSL=false                         # Enable SSL (set to true for cloud databases)
```

### Important Notes

- **DATABASE_SYNCHRONIZE**: Should be `false` in production. When `true`, TypeORM automatically syncs entity changes to the database (useful for rapid development but unsafe for production).
- **DATABASE_SSL**: Set to `true` when connecting to cloud databases (like Render, AWS RDS, etc.)
- **DATABASE_LOGGING**: Set to `false` in production to reduce noise

## Local Database Setup

### Option 1: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker
docker run --name hubex-postgres \
  -e POSTGRES_USER=hubex_user \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=hubex \
  -p 5432:5432 \
  -d postgres:15-alpine

# Verify it's running
docker ps
```

### Option 2: Manual Installation

1. **Install PostgreSQL**:
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from https://www.postgresql.org/download/windows/

2. **Create Database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create user and database
   CREATE USER hubex_user WITH PASSWORD 'your_password';
   CREATE DATABASE hubex OWNER hubex_user;
   GRANT ALL PRIVILEGES ON DATABASE hubex TO hubex_user;

   # Exit
   \q
   ```

3. **Test Connection**:
   ```bash
   psql -U hubex_user -d hubex -h localhost
   ```

## Migrations

### What are Migrations?

Migrations are version-controlled database schema changes. They allow you to:
- Track database schema changes over time
- Share schema changes with your team
- Deploy consistent database changes across environments
- Roll back changes if needed

### Migration Commands

#### Run Migrations

Apply pending migrations to your database:

```bash
npm run migration:run
```

#### Generate Migration

Automatically generate a migration based on entity changes:

```bash
npm run migration:generate -- src/database/migrations/DescriptiveName
```

Example:
```bash
npm run migration:generate -- src/database/migrations/AddUserRoleColumn
```

#### Create Empty Migration

Create a blank migration file for custom SQL:

```bash
npm run migration:create -- src/database/migrations/CustomMigrationName
```

#### Revert Migration

Revert the most recently applied migration:

```bash
npm run migration:revert
```

### Migration Workflow

1. **Make Entity Changes**: Modify your `.entity.ts` files
2. **Generate Migration**: Run `npm run migration:generate`
3. **Review Migration**: Check the generated file in `src/database/migrations/`
4. **Test Locally**: Run `npm run migration:run` to test
5. **Commit Migration**: Add the migration file to version control
6. **Deploy**: Run migrations on staging/production

### Example Migration

Here's what a generated migration looks like:

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRoleColumn1234567890 implements MigrationInterface {
    name = 'AddUserRoleColumn1234567890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "role" character varying NOT NULL DEFAULT 'user'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "role"
        `);
    }
}
```

## Database Schema

### Entities

The database includes the following tables:

#### Users
- `id` - UUID primary key
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `firstName` - User's first name (optional)
- `lastName` - User's last name (optional)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

#### Workflows
- `id` - UUID primary key
- `name` - Workflow name
- `description` - Optional description
- `config` - JSONB workflow configuration
- `isActive` - Boolean active status
- `isPublished` - Boolean published status
- `slug` - Unique slug for public access
- `userId` - Foreign key to Users
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

#### Auth Configs
- `id` - UUID primary key
- `name` - Config name
- `type` - Enum (api_key, oauth2, basic_auth)
- `data` - JSONB encrypted credentials
- `userId` - Foreign key to Users
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

#### Execution Logs
- `id` - UUID primary key
- `workflowId` - Foreign key to Workflows
- `status` - Enum (success, error, running)
- `input` - JSONB execution input
- `output` - JSONB execution output
- `error` - Error message (optional)
- `executionTime` - Duration in milliseconds
- `startedAt` - Timestamp
- `completedAt` - Timestamp (optional)

### Relationships

```
Users (1) ───< (N) Workflows
Users (1) ───< (N) AuthConfigs
Workflows (1) ───< (N) ExecutionLogs
```

## Troubleshooting

### Migration Errors

#### "Cannot find module data-source.ts"

**Solution**: The data source file was missing. It has been created at `src/database/data-source.ts`.

#### "No changes in database schema were found"

**Cause**: Your entity definitions match the current database schema.

**Solutions**:
1. If you made entity changes, check that they're properly decorated
2. If you need an empty migration, use `migration:create` instead
3. Verify your entities are imported in `app.module.ts`

#### "Connection refused" or "ECONNREFUSED"

**Cause**: Cannot connect to PostgreSQL.

**Solutions**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check your `.env` credentials
3. Ensure the database exists
4. Check firewall rules (especially for remote databases)

#### "Password authentication failed"

**Cause**: Incorrect database credentials.

**Solutions**:
1. Verify `DATABASE_USER` and `DATABASE_PASSWORD` in `.env`
2. Reset the password if needed:
   ```sql
   ALTER USER hubex_user WITH PASSWORD 'new_password';
   ```

#### "Database does not exist"

**Cause**: The specified database hasn't been created.

**Solution**:
```sql
CREATE DATABASE hubex;
```

### Connection Issues

#### SSL Required

If using cloud databases (Render, AWS, etc.), set:
```env
DATABASE_SSL=true
```

#### Connection Timeout

Increase timeout in `src/database/data-source.ts`:
```typescript
export const AppDataSource = new DataSource({
  // ... other options
  connectTimeoutMS: 10000,
  extra: {
    connectionTimeoutMillis: 10000,
  }
});
```

## Database Management

### View Current Schema

```bash
# Connect to database
psql -U hubex_user -d hubex -h localhost

# List all tables
\dt

# Describe a table
\d users

# View table data
SELECT * FROM users;

# Exit
\q
```

### Backup Database

```bash
# Create backup
pg_dump -U hubex_user -h localhost hubex > hubex_backup.sql

# Restore backup
psql -U hubex_user -h localhost hubex < hubex_backup.sql
```

### Reset Database (Development Only!)

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE hubex;"
psql -U postgres -c "CREATE DATABASE hubex OWNER hubex_user;"

# Run migrations
npm run migration:run
```

## Production Considerations

### Security

1. **Use Strong Passwords**: Generate secure database passwords
2. **Enable SSL**: Always use SSL in production
3. **Restrict Access**: Use firewall rules to limit database access
4. **Regular Backups**: Schedule automated backups
5. **Read Replicas**: Consider read replicas for scaling

### Environment Setup

```env
# Production Environment Variables
NODE_ENV=production
DATABASE_HOST=your-db-host.com
DATABASE_PORT=5432
DATABASE_USER=hubex_prod_user
DATABASE_PASSWORD=strong-random-password
DATABASE_NAME=hubex_production
DATABASE_SYNCHRONIZE=false        # NEVER true in production
DATABASE_LOGGING=false            # Disable in production
DATABASE_SSL=true                 # Enable in production
```

### Migration Strategy

1. **Test Migrations**: Always test on staging first
2. **Backup Before Migration**: Create a backup before applying migrations
3. **Monitor Execution**: Watch for errors during migration
4. **Rollback Plan**: Have a rollback plan ready
5. **Downtime Window**: Schedule migrations during low-traffic periods

### Connection Pooling

TypeORM automatically handles connection pooling. For high-traffic applications, configure:

```typescript
export const AppDataSource = new DataSource({
  // ... other options
  extra: {
    max: 20,  // Maximum pool size
    min: 5,   // Minimum pool size
    idleTimeoutMillis: 30000,
  }
});
```

## Monitoring

### Check Migration Status

```bash
npm run migration:show
```

### Query Logging

Enable in development to debug SQL queries:
```env
DATABASE_LOGGING=true
```

View logs in your application console.

## Additional Resources

- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM Migrations Guide](https://typeorm.io/migrations)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl-best-practices.html)

## Support

For database-related issues:
1. Check this documentation
2. Review TypeORM logs
3. Verify PostgreSQL is running
4. Check `.env` configuration
5. Create a GitHub issue with error details

---

**Status**: ✅ Database connection configured and working

**Data Source File**: [src/database/data-source.ts](src/database/data-source.ts)

**Migrations Directory**: [src/database/migrations/](src/database/migrations/)
