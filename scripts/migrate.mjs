// Corre las migraciones de Drizzle usando la API programática.
// Se ejecuta en el CMD del Dockerfile antes de iniciar el servidor.
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)

// In Docker the migrations are copied to /app/scripts/migrations
// In local dev they're at src/db/migrations (relative to project root)
const migrationsFolder = process.env.NODE_ENV === 'production'
  ? join(__dirname, 'migrations')
  : join(__dirname, '../src/db/migrations')

await migrate(db, { migrationsFolder })
await pool.end()

console.log('✓ Migraciones aplicadas')
