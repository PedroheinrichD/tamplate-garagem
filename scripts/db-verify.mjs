// Verificação real das estruturas criadas pela migration.
// Uso: node scripts/db-verify.mjs
import { readFileSync } from "node:fs";
import { join } from "node:path";
import mariadb from "mariadb";

process.loadEnvFile(".env");

function readCaCert() {
  const fromEnv = process.env.DB_CA_CERT;
  if (fromEnv) return fromEnv.includes("\\n") ? fromEnv.replace(/\\n/g, "\n") : fromEnv;
  return readFileSync(join(process.cwd(), "certs", "ca.pem"), "utf8");
}

const url = new URL(process.env.DATABASE_URL);
const database = url.pathname.replace(/^\//, "");
const conn = await mariadb.createConnection({
  host: url.hostname,
  port: Number(url.port),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database,
  ssl: {
    ca: readCaCert(),
    rejectUnauthorized: true,
  },
  connectTimeout: 15000,
});

const q = (sql, params) => conn.query(sql, params);

const tables = await q(
  `select table_name as table_name from information_schema.tables
   where table_schema = ? and table_type = 'BASE TABLE'
   order by table_name`,
  [database],
);

const enums = await q(
  `select table_name as table_name, column_name as column_name, column_type as column_type
   from information_schema.columns
   where table_schema = ? and data_type = 'enum'
   order by table_name, column_name`,
  [database],
);

const fks = await q(
  `select
     kcu.constraint_name as conname,
     kcu.table_name as tabela,
     kcu.referenced_table_name as referencia,
     rc.delete_rule as on_delete
   from information_schema.key_column_usage kcu
   join information_schema.referential_constraints rc
     on rc.constraint_schema = kcu.constraint_schema
    and rc.constraint_name = kcu.constraint_name
   where kcu.table_schema = ? and kcu.referenced_table_name is not null
   order by kcu.constraint_name`,
  [database],
);

const indexes = await q(
  `select distinct table_name as tablename, index_name as indexname
   from information_schema.statistics
   where table_schema = ?
   order by table_name, index_name`,
  [database],
);

const prismaMigrations = await q(
  `select migration_name, finished_at, applied_steps_count
   from _prisma_migrations order by started_at`,
);

console.log("TABELAS (" + tables.length + "):");
tables.forEach((t) => console.log("  -", t.table_name));

console.log("\nENUMS (" + enums.length + "):");
enums.forEach((e) =>
  console.log("  -", `${e.table_name}.${e.column_name}`, "=", e.column_type),
);

console.log("\nFOREIGN KEYS (" + fks.length + "):");
fks.forEach((f) =>
  console.log(`  - ${f.conname}: ${f.tabela} -> ${f.referencia} (ON DELETE ${f.on_delete})`),
);

console.log("\nINDEXES (" + indexes.length + "):");
indexes.forEach((i) => console.log("  -", i.tablename + "." + i.indexname));

console.log("\n_prisma_migrations:");
prismaMigrations.forEach((m) =>
  console.log(`  - ${m.migration_name} | steps=${m.applied_steps_count} | finished=${m.finished_at ? "sim" : "NAO"}`),
);

await conn.end();
