// Teste rápido de conexão com o PostgreSQL do Supabase.
// Uso: npm run db:test
import pg from "pg";

process.loadEnvFile(".env");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL não encontrada no .env");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });

try {
  await client.connect();
  const { rows } = await client.query(
    "select current_database() as db, current_user as usuario, version() as versao",
  );
  console.log("Conexão OK");
  console.log("  banco  :", rows[0].db);
  console.log("  usuário:", rows[0].usuario);
  console.log("  server :", rows[0].versao.split(",")[0]);
  process.exit(0);
} catch (err) {
  console.error("Conexão FALHOU:", err.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
