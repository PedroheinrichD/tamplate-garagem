// Verificação real das estruturas criadas pela migration.
// Uso: node scripts/db-verify.mjs
import pg from "pg";

process.loadEnvFile(".env");

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const q = (sql, params) => client.query(sql, params).then((r) => r.rows);

const tables = await q(`
  select table_name from information_schema.tables
  where table_schema = 'public' and table_type = 'BASE TABLE'
  order by table_name`);

const enums = await q(`
  select t.typname, string_agg(e.enumlabel, ', ' order by e.enumsortorder) as labels
  from pg_type t
  join pg_enum e on e.enumtypid = t.oid
  join pg_namespace n on n.oid = t.typnamespace
  where n.nspname = 'public'
  group by t.typname order by t.typname`);

const fks = await q(`
  select con.conname, cl.relname as tabela, cf.relname as referencia, con.confdeltype as on_delete
  from pg_constraint con
  join pg_class cl on cl.oid = con.conrelid
  join pg_class cf on cf.oid = con.confrelid
  join pg_namespace n on n.oid = con.connamespace
  where con.contype = 'f' and n.nspname = 'public'
  order by con.conname`);

const indexes = await q(`
  select tablename, indexname, indexdef
  from pg_indexes where schemaname = 'public'
  order by tablename, indexname`);

const prismaMigrations = await q(
  `select migration_name, finished_at, applied_steps_count
   from "_prisma_migrations" order by started_at`,
);

console.log("TABELAS (" + tables.length + "):");
tables.forEach((t) => console.log("  -", t.table_name));

console.log("\nENUMS (" + enums.length + "):");
enums.forEach((e) => console.log("  -", e.typname, "=", e.labels));

console.log("\nFOREIGN KEYS (" + fks.length + "):");
const delMap = { a: "NO ACTION", r: "RESTRICT", c: "CASCADE", n: "SET NULL", d: "SET DEFAULT" };
fks.forEach((f) =>
  console.log(`  - ${f.conname}: ${f.tabela} -> ${f.referencia} (ON DELETE ${delMap[f.on_delete] || f.on_delete})`),
);

console.log("\nINDEXES (" + indexes.length + "):");
indexes.forEach((i) => console.log("  -", i.tablename + "." + i.indexname));

console.log("\n_prisma_migrations:");
prismaMigrations.forEach((m) =>
  console.log(`  - ${m.migration_name} | steps=${m.applied_steps_count} | finished=${m.finished_at ? "sim" : "NAO"}`),
);

await client.end();
