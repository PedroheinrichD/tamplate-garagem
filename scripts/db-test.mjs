// Teste rápido de conexão com o MySQL da Aiven.
// Uso: npm run db:test
import { readFileSync } from "node:fs";
import { join } from "node:path";
import mariadb from "mariadb";

process.loadEnvFile(".env");

const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error("DATABASE_URL não encontrada no .env");
  process.exit(1);
}

const url = new URL(raw);
const config = {
  host: url.hostname,
  port: Number(url.port),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ""),
  ssl: {
    ca: readFileSync(join(process.cwd(), "certs", "ca.pem"), "utf8"),
    rejectUnauthorized: true,
  },
  connectTimeout: 15000,
};

let conn;
try {
  conn = await mariadb.createConnection(config);
  const rows = await conn.query(
    "select database() as db, current_user() as usuario, version() as versao",
  );
  console.log("Conexão OK");
  console.log("  banco  :", rows[0].db);
  console.log("  usuário:", rows[0].usuario);
  console.log("  server :", rows[0].versao);
  process.exit(0);
} catch (err) {
  console.error("Conexão FALHOU:", err.message);
  process.exit(1);
} finally {
  await conn?.end().catch(() => {});
}
