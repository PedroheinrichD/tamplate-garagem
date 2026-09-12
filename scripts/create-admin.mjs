// Cria (ou confirma) o usuário admin no Supabase Auth a partir do .env.
// Uso: npm run admin:create
// Requer no .env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//                 ADMIN_EMAIL, ADMIN_PASSWORD
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

const missing = [];
if (!url || url.startsWith("COLE_")) missing.push("NEXT_PUBLIC_SUPABASE_URL");
if (!serviceKey || serviceKey.startsWith("COLE_"))
  missing.push("SUPABASE_SERVICE_ROLE_KEY");
if (!email) missing.push("ADMIN_EMAIL");
if (!password) missing.push("ADMIN_PASSWORD");
if (missing.length) {
  console.error("Faltam variáveis no .env:", missing.join(", "));
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  if (/already.*registered|exists/i.test(error.message)) {
    console.log(`Usuário ${email} já existe. Nada a fazer.`);
    process.exit(0);
  }
  console.error("Falhou:", error.message);
  process.exit(1);
}

console.log(`Usuário admin criado: ${data.user?.email}`);
