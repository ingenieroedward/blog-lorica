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

await migrate(db, { migrationsFolder: join(__dirname, '../src/db/migrations') })
await pool.end()

console.log('✓ Migraciones aplicadas')
