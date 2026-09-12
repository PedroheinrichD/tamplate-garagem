@AGENTS.md

# Benevento's Veículos - site institucional + catálogo

## O que é

Site de uma concessionária de seminovos (compra, venda, troca e financiamento).
Cliente real: Benevento's Veículos (Instagram @beneventoveiculos, +700 carros
vendidos em 3 anos). Visual cinematográfico escuro, alto contraste, um único
acento vermelho puxado da fachada da loja. Referência de tom: marca automotiva,
não marketplace.

Ligado ao MySQL da Aiven via Prisma (estoque, leads, depoimentos, config).
Painel admin (`/admin`, Better Auth) faz o CRUD de veículos e o upload das
fotos (Cloudinary). Fotos de veículo do seed são `picsum` (dev) até o admin
subir as reais; hero/fachada/mapa ainda usam `Placeholder`. Sem Supabase em
nenhuma camada (banco, auth e storage já foram todos substituídos).

## Stack

- **Next.js 16** (App Router, Turbopack por padrão em dev e build) + TypeScript
- **React 19.2**
- **Tailwind CSS v4** via `@tailwindcss/postcss`, com tokens em `@theme` dentro
  de `src/app/globals.css`. Sem CSS Modules, sem CSS-in-JS.
- **GSAP + ScrollTrigger** para o scroll cinematográfico
- **Lenis** para scroll suave (roda no ticker do GSAP para ficar em fase com o
  ScrollTrigger)
- **@phosphor-icons/react** (import de `/dist/ssr`), uma família só de ícones
- **next/font/google**: Archivo (display) + Inter (corpo/UI)

### Notas de Next 16 (mudou em relação ao que você provavelmente conhece)

- `params` e `searchParams` são **Promises**: `const { id } = await params`.
  Tipar com `PageProps<'/rota'>` / `LayoutProps<'/rota'>` (globais, gerados por
  `next dev` / `next build` / `next typegen`).
- Turbopack é padrão. `next lint` não existe mais: lint é `eslint` direto
  (`package.json` já tem `"lint": "eslint"`), flat config em `eslint.config.mjs`.
- `next.config.ts` fixa `turbopack.root` porque há um `package-lock.json` solto
  na pasta do usuário que confundia a detecção de workspace.
- Imagens locais/remotas: `images.qualities` default é `[75]`; `images.domains`
  saiu, usar `remotePatterns`.

## Comandos

```
npm install
npm run dev          # http://localhost:3000
npm run build
npx tsc --noEmit     # checagem de tipos
npx eslint src       # lint
npx next typegen     # regenera PageProps/LayoutProps se preciso
npm run db:test      # testa a conexão com o MySQL da Aiven
npm run db:verify    # confere tabelas / enums / FKs / índices no banco
npm run db:seed      # (re)popula veículos, fotos, depoimentos, config (idempotente)
npm run db:studio    # abre o Prisma Studio
npm run admin:create # cria o usuário admin (Better Auth) a partir do .env
npx prisma migrate dev --name <x>   # nova migration (Session pooler)
npx prisma generate  # regenera o Prisma Client (roda no postinstall também)
```

Rodar `tsc --noEmit` + `eslint src` + `next build` antes de considerar
qualquer etapa concluída.

## Estrutura

```
src/
  proxy.ts               protege /admin/* (Next 16, ex-middleware.ts)
  app/
    layout.tsx           só <html><body> + fonts + metadata
    globals.css          @import tailwindcss + tokens (@theme) + base + motion CSS
    icon.svg             favicon (monograma B)
    not-found.tsx        404 global (sem chrome)
    sitemap.ts           rotas + slugs de veiculos do banco
    (site)/              route group do site público
      layout.tsx         SmoothScroll + SiteHeader + SiteFooter
      page.tsx           Home
      not-found.tsx      404 com chrome (usado pelo notFound() das rotas de site)
      estoque/page.tsx           catálogo (EstoqueBrowser), força dynamic
      estoque/[id]/page.tsx      página do veículo por slug + generateMetadata
      sobre/page.tsx  contato/page.tsx
    admin/              painel (fora do (site), shell próprio, tudo requireUser)
      layout.tsx  login/  page.tsx (stats)  destaques/  leads/  config/
      veiculos/  veiculos/novo/  veiculos/[id]/  (CRUD + fotos)
    api/auth/[...all]/route.ts   toNextJsHandler(auth) - rotas do Better Auth
    actions/
      leads.ts     "use server" - submitContact/Trade/InterestLead
      auth.ts      "use server" - signIn / signOut (Better Auth)
      vehicles.ts  "use server" - saveVehicle, deleteVehicle, upload/move/removePhoto,
                   setFeaturedPosition, clearFeaturedPosition
      config.ts    "use server" - updateSiteConfig

  components/
    motion/    SmoothScroll, Reveal, SplitLines, Parallax, Magnetic
    layout/    SiteHeader (client), SiteFooter (server, async, getSiteConfig)
    ui/        Container, Button, WhatsappCta, SectionIntro, Placeholder
    home/      Hero, ProofBar, FeaturedVehicles, Services, Financing,
               TradeIn, WhyUs, Testimonials, VisitUs
    vehicle/   VehicleCard, VehicleImage, EstoqueBrowser (client), Gallery (client),
               VehicleInterestForm (client)
    contato/   ContactForm (client)
    admin/     VehicleForm, PhotoManager, DeleteVehicleButton, DestaquesManager,
               AdminHeader, SiteConfigForm (client)

  types/vehicle.ts     interface Vehicle (+ VehiclePhoto, VehicleStatus)
  lib/
    site.ts            defaults institucionais (fallback do getSiteConfig)
    site-config.ts     server-only: getSiteConfig() (tabela configuracoes + fallback)
    db.ts              PrismaClient server-only + adapter mariadb (MySQL/Aiven) + omit
                       dos campos admin
    vehicles.ts        server-only, Prisma. get* + toVehicle()
    vehicle-format.ts  puro/isomórfico: formatPrice/Mileage/Year, filterVehicles
    vehicle-schema.ts  zod + options do form de veículo (isomórfico)
    config-schema.ts   zod do form de configuração (isomórfico)
    content.ts         server-only: getTestimonials()
    leads.ts           server-only: valida (zod) + grava leads
    admin.ts           server-only: consultas do painel (+ getVehicleForAdmin)
    better-auth.ts     server-only: instância betterAuth() (Prisma adapter, MySQL)
    auth.ts            server-only: getCurrentUser / requireUser (usa better-auth.ts)
    cloudinary.ts      server-only: upload/delete de fotos (Cloudinary)
    useIsomorphicLayoutEffect.ts

prisma/schema.prisma   modelos do banco (ver "Banco de dados") + user/session/account/
                       verification (Better Auth)
prisma/migrations/     init (MySQL) + add_better_auth
prisma/seed.mjs        dados iniciais (npm run db:seed)
prisma.config.ts       config do Prisma 7 (schema + URL de migrations, lê do .env)
scripts/               db-test.mjs, db-verify.mjs, create-admin.mjs
```

## Design system

Tema **único**: escuro, comprometido (sem modo claro). `color-scheme: dark`.
Tudo definido em `src/app/globals.css`.

### Cor (tokens em `:root`, mapeados em `@theme` -> utilitários `bg-*`, `text-*`)

| token | valor | uso |
|---|---|---|
| `--bg` | `#0b0b0c` | fundo base |
| `--bg-elev` | `#121214` | seções alternadas, footer |
| `--surface` | `#17171a` | cards, formulários |
| `--surface-2` | `#1e1e22` | superfície mais alta |
| `--fg` | `#eeece7` | texto primário (off-white quente) |
| `--fg-dim` | `#b6b4ae` | texto secundário |
| `--muted` | `#86858b` | labels, legendas |
| `--border` | `#2a2a2f` | divisores 1px |
| `--border-strong` | `#3a3a41` | bordas de input/botão outline |
| `--accent` | `#c22a22` | vermelho - CTAs, kickers, números-chave. Usar com moderação |
| `--accent-hover` | `#dc4136` | hover do acento, texto de erro |
| `--accent-ink` | `#fdecea` | texto sobre fundo acento |

Regra: **um acento só**, o mesmo na página inteira. Sem segundo acento.

### Tipografia

- **Display** (`font-display`, Archivo): headlines, nomes de modelo, preços.
  Peso 600, `letter-spacing: -0.02em`, `text-wrap: balance`.
- **Sans** (`font-sans`, Inter): corpo, nav, specs, labels.
- Headlines de seção: `text-[clamp(1.6rem,6vw,3rem)]`. Hero: `clamp(2rem,8.5vw,5rem)`.
  Os mínimos do clamp são baixos de propósito para caber em 360-390px.
- Números (preço, km, ano): classe `.tnum` (tabular-nums).
- Nunca all-caps via CSS para labels/eyebrows. Sem `→` em botão/link.
- Sem serifa. Sem `Fraunces`/`Instrument_Serif`.

### Espaçamento e forma

- Escala do Tailwind v4 (base 0.25rem). Densidade baixa-média.
- Seções: `py-16 md:py-24`. Hero: `min-h-[100svh]` (nunca `h-screen`).
- **Um border-radius só**: `--radius` = 3px (`rounded`). Cards, inputs, botões.
- **Sem `box-shadow`**. Profundidade vem de contraste tonal e borda 1px.
- Hover em imagem de card: `scale(1.03)`, 400-500ms, ease `cubic-bezier(0.65,0,0.35,1)`.
- `:active` em botão: `translate-y-px` (feedback tátil).

### Regras de composição herdadas (anti-slop)

- Máximo 1 kicker/eyebrow a cada 3 seções (hoje: hero, FeaturedVehicles, WhyUs).
  Preferir headline sozinha.
- Sem `—` (travessão) em lugar nenhum visível. Usar hífen, vírgula ou frase nova.
- Sem numeração 01/02/03 em conteúdo que não é sequência (Compra/Venda/Troca
  não são passos, são serviços paralelos).
- Layout: no máximo 2 seções seguidas com o mesmo padrão "texto + visual lado a
  lado". Alternar famílias de layout.
- Bento: nº de células = nº de itens, sem célula vazia.
- Placeholder de foto sempre marcado ("Foto ilustrativa") e com comentário
  `{/* TODO: foto real */}` no ponto de uso.

## Sistema de movimento

Objetivo: sensação cinematográfica coesa, não uma animação isolada. Sutil,
intencional, guiando a ordem de leitura.

- **`SmoothScroll`** (`layout.tsx`, renderiza null): inicia o Lenis e o pluga no
  `gsap.ticker`; `lenis.on("scroll", ScrollTrigger.update)`. Dá `ScrollTrigger.refresh()`
  ao trocar de rota. Se `prefers-reduced-motion: reduce`, não inicia Lenis.
- **`Hero`**: timeline de `ScrollTrigger` com `scrub` presa à seção
  (`start "top top"`, `end "bottom top"`). O "carro" (placeholder) cresce
  (`scale 1.16`), gira `2.2deg` e sobe; o texto sobe e some; o scrim escurece.
  É a "aproximação de câmera". Sem `pin` (mais robusto).
- **`SplitLines`**: título revelado linha a linha por máscara. As quebras são o
  array `lines` passado pelo chamador (sem medição frágil de layout). `immediate`
  = anima ao montar (hero); senão anima no scroll (`start "top 90%"`).
- **`Reveal`**: revela o próprio elemento ou, com `stagger`, os filhos
  `[data-reveal-item]` em sequência. Variantes: `fade-up`, `blur-in`, `rise`, `scale`.
- **`Parallax`**: deslocamento vertical sutil com `scrub`.
- **`Magnetic`**: atração leve ao cursor no CTA principal (desktop, ponteiro fino).

**Regras:**
- Todo componente de motion é client-leaf isolado (`"use client"` no topo),
  usa `useIsomorphicLayoutEffect`, `gsap.context()` e `return () => ctx.revert()`.
- Todo componente checa `matchMedia("(prefers-reduced-motion: reduce)")` e **sai
  cedo**, deixando o conteúdo visível e estático. Sem JS, o conteúdo aparece
  normal (as revelações não escondem nada via CSS).
- **Proibido** `window.addEventListener("scroll", ...)`. Usar ScrollTrigger,
  IntersectionObserver (o header usa uma sentinela no body) ou o evento do Lenis.
- Só `transform` / `opacity` / `clip-path` animados no scroll. Nunca `top/left/width/height`.

## Camada de dados

O site roda ligado ao MySQL da Aiven (ver "Banco de dados"). Toda leitura
passa por `src/lib/{vehicles,content,site-config,admin}.ts` (server-only) ou pelos
puros de `src/lib/vehicle-format.ts`. Nada de Prisma nos Client Components.

- `/estoque` busca a lista no servidor e passa para o `EstoqueBrowser` (client),
  que filtra/ordena em memória com `filterVehicles`.
- `/estoque/[id]` resolve o veículo por **slug** (`getVehicleBySlug`, cacheada),
  `notFound()` → 404. Galeria vem de `veiculo_fotos` ordenada por `position`.
- Formulários gravam lead real (server action + `zod`) **e** abrem o WhatsApp.

### Banco de dados

- **Engine:** MySQL, hospedado na Aiven.
- **ORM:** Prisma 7 (`prisma` + `@prisma/client` + `@prisma/adapter-mariadb` +
  `mariadb`). `@prisma/adapter-mariadb` é o driver adapter **oficial** da
  Prisma 7 para o wire protocol MySQL (não existe `@prisma/adapter-mysql`
  separado - MySQL e MariaDB falam o mesmo protocolo e a Prisma unificou os
  dois nesse pacote). Não instala nem roda nenhum servidor MariaDB, só
  conecta no MySQL da Aiven.

**Arquitetura Prisma 7 (mudou):**
- O schema fica em `prisma/schema.prisma`. O `datasource` só declara `provider`,
  **nunca a URL** (o Prisma 7 proíbe `url` no schema).
- `prisma.config.ts` (raiz) usa `DATABASE_URL` para CLI/migrations (a Aiven não
  tem o split pooler transaction/session que o Supabase tinha, então não há
  mais `DIRECT_URL`). Carrega o `.env` com `process.loadEnvFile(".env")`
  (Prisma 7 não carrega `.env` sozinho quando existe `prisma.config.ts`). A
  URL usada pelo schema engine ganha `sslaccept=strict&sslcert=certs/ca.pem`
  (TLS obrigatório na Aiven) e `connect_timeout=15` (o default do engine é
  curto demais pro round-trip até a Aiven).
- Runtime: `src/lib/db.ts` parseia `DATABASE_URL` e monta um `PoolConfig` pro
  adapter `PrismaMariaDb` (`ssl: { ca, rejectUnauthorized: true }`,
  `connectTimeout: 15000`) - o driver `mariadb` não aceita CA customizado numa
  connection string simples, só via objeto. `import "server-only"` no topo: o
  build quebra se for importado de um Client Component. `DATABASE_URL` não tem
  prefixo `NEXT_PUBLIC_`, nunca vai para o browser.
- **Conexão (`.env`):** `DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"`,
  uma única URL (sem split pooler). As peças soltas (`DB_HOST`, `DB_PORT`,
  `DB_USER`, `DB_PASSWORD`, `DB_NAME`) continuam no `.env` como referência.
- **CA certificate, dois caminhos** (função `readCaCert()`, duplicada em
  `src/lib/db.ts` e em cada script standalone - mesmo padrão de duplicação já
  usado pra criação do client Prisma):
  - **Dev local:** arquivo `certs/ca.pem` (baixado no painel da Aiven),
    coberto pelo `*.pem` do `.gitignore` - não vai pro git.
  - **Produção (Vercel etc., sem filesystem persistente pra esse arquivo):**
    env var `DB_CA_CERT` com o PEM inteiro colado como "Secret" - a Vercel
    preserva as quebras de linha; se vier com `\n` escapado em vez de quebra
    real, `readCaCert()` desescapa. `DB_CA_CERT`, quando setada, tem
    prioridade sobre o arquivo.
  - Exceção: o schema engine da Prisma (`prisma.config.ts`, usado por
    `migrate`/`db pull`/`studio`) só aceita **caminho de arquivo** no
    `sslcert` da URL, não o conteúdo direto - então rodar migration contra o
    banco de produção continua exigindo `certs/ca.pem` presente localmente
    (não é afetado por isso: `next build` não aciona migration nenhuma).
- **Campos administrativos de `Vehicle`** (`licensePlate`, `renavam`, `chassis`,
  `fipeCode`, `purchaseCost`, `internalNotes`): `omit` global no `PrismaClient`
  (`VEHICLE_ADMIN_FIELDS` em `src/lib/db.ts`). Toda query os exclui por padrão;
  só `src/lib/admin.ts` (`getVehiclesForAdmin`, com `omit: { <campo>: false }`)
  os lê.
- `postinstall` roda `prisma generate`. Scripts: `db:test` (conexão),
  `db:verify` (tabelas/enums/FKs/índices via `information_schema`), `db:seed`,
  `db:studio`, `admin:create` (cria o usuário admin no Better Auth a partir
  do `.env`).
- Credenciais só em `.env` (coberto por `.gitignore`, padrão `.env*`).
- **Vulnerabilidade conhecida do driver `mariadb`:** a versão que
  `@prisma/adapter-mariadb` fixa (3.4.5) tem uma falha de vazamento de senha
  em cleartext pro MitM (`GHSA-cqhc-2h57-wpxf`, corrigida na 3.4.6+). Fixado
  via `overrides` (`"mariadb": ">=3.4.7"`) - mesmo padrão já usado pra
  `mysql2`/`deepmerge-ts`. `npm audit`: 0 vulnerabilidades.

**Fluxo de dados (mocks -> banco):** `data/vehicles.ts` foi removido. A UI
consome de:
- `src/lib/vehicle-format.ts` — puro (formatação + `filterVehicles`), isomórfico,
  usado pelo `EstoqueBrowser` (client) e por Server Components.
- `src/lib/vehicles.ts` — `server-only`, Prisma. `getVehicles`, `getFeaturedVehicles`,
  `getVehicleBySlug` (cacheada, = `getVehicleById`), `getRelatedVehicles`,
  `getBrands`, `getBodyTypes`, `getPriceRange`, `countVehicles`. `toVehicle()`
  mapeia a linha do Prisma para o `Vehicle` do front (enum -> rótulo, `id` = slug,
  `photos` de `veiculo_fotos`).
- `src/lib/content.ts` — `getTestimonials()` (tabela `depoimentos`).
- `src/lib/site-config.ts` — `getSiteConfig()` (tabela `configuracoes`, cacheada,
  **fallback total para `src/lib/site.ts`**). Consome no servidor: `SiteFooter`,
  `VisitUs`, `/contato`. Editável em `/admin/config`. Header/Hero/CTAs de client
  ainda leem `site.ts` (copy de marca + número, não sensível) — manter os dois em
  sincronia até uma migração via context.
- Tudo dentro de `src/app/(site)/` é `force-dynamic` (o layout força), sempre
  reflete o banco. `/admin/*` também.
- `VehicleImage` renderiza `veiculo_fotos` via `next/image` (hosts em
  `next.config.ts` `images.remotePatterns`: `picsum.photos` para o seed de dev,
  `res.cloudinary.com` para as reais); sem foto cai no `Placeholder`.

**Leads:** `src/lib/leads.ts` (`server-only`, valida com `zod`) +
`src/app/actions/leads.ts` (`"use server"`). `ContactForm`, `TradeIn` e
`VehicleInterestForm` chamam a action, gravam em `leads` (status `NEW`,
`vehicleId` quando há veículo) e ainda abrem o WhatsApp. **Nenhuma leitura
pública de `leads`** — só `src/lib/admin.ts`, dentro de `/admin`.

**Auth / admin (Better Auth, sem Supabase Auth, painel de um usuário só):**
- `src/lib/better-auth.ts` — instância `betterAuth()` com `prismaAdapter(prisma,
  { provider: "mysql" })` (reusa o `prisma` de `src/lib/db.ts`; o `omit` global
  de lá só afeta `Vehicle`, não afeta `user`/`session`/`account`).
  `emailAndPassword: { enabled: true, disableSignUp: true }` — login habilitado,
  **autorregistro desligado** (`disableSignUp`, checado no próprio handler da
  rota `/api/auth/sign-up/email`; único jeito de criar usuário é
  `npm run admin:create`, que roda `auth.api.signUpEmail` fora dessa restrição
  numa instância à parte, só no script). Plugin `nextCookies()` **tem que ser o
  último** da lista: é ele quem propaga o cookie de sessão pro `next/headers`
  quando `auth.api.signInEmail`/`signOut` são chamados de dentro de uma Server
  Action (sem ele o cookie não seria setado).
- `src/app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)`, expõe as
  rotas do Better Auth (`/api/auth/sign-in/email`, `/sign-out`, etc.).
- `src/proxy.ts` (ex-`middleware.ts`) protege `/admin/*` (`matcher`) chamando
  `auth.api.getSession()` direto (Next 16 roda Proxy em runtime **Node.js** por
  padrão, então dá pra bater no banco ali sem os truques de Edge runtime que
  versões antigas do Next exigiriam).
- `src/lib/auth.ts` — `getCurrentUser()` (nunca lança, usa `auth.api.getSession`
  com `headers()` do `next/headers`), `requireUser()` (redirect pro login).
- Route group `src/app/(site)/` = shell público (SmoothScroll + header + footer);
  `src/app/admin/` fora dele, shell próprio. `layout.tsx` raiz virou só
  `<html><body>`.
- **CRUD de veículos** (`src/app/actions/vehicles.ts`, guardado por `requireUser`):
  `/admin/veiculos` (lista) · `/admin/veiculos/novo` · `/admin/veiculos/[id]`
  (editar + `PhotoManager` + excluir). `saveVehicle` valida com
  `src/lib/vehicle-schema.ts`. Excluir veículo apaga também os objetos no Storage.
- **Destaques da home** (`/admin/destaques`, `DestaquesManager` client):
  3 posições fixas (1 = card grande, 2 e 3 = cards menores). Clicar numa posição
  vazia abre a lista de veículos disponíveis (capa + nome); escolher um chama
  `setFeaturedPosition(posição, vehicleId)`, que zera quem estava naquela posição
  e move o veículo escolhido pra lá (transação, respeitando o `@unique` de
  `featuredPosition`). `clearFeaturedPosition` esvazia uma posição. A home
  (`getFeaturedVehicles`) só mostra quem está com `status: AVAILABLE`; se o
  veículo escolhido sair de disponível, o slot mostra um aviso mas não limpa
  sozinho — o admin troca manualmente.
- **Fotos = upload do admin, via Cloudinary.** `src/lib/cloudinary.ts`
  (server-only, `CLOUDINARY_API_SECRET` nunca no client) sobe pra pasta
  `veiculos/<slug>` de cada veículo (`cloudinary.uploader.upload_stream`,
  `public_id` = UUID aleatório), grava url/alt/position em `veiculo_fotos`.
  Deletar extrai o `public_id` de volta a partir da própria URL salva (regex
  em cima de `/upload/(v<versão>/)?<public_id>.<ext>` — não guardamos o
  `public_id` num campo separado, igual já era feito com o path do Supabase
  Storage antes). `PhotoManager` faz upload múltiplo, reordenar (setas) e
  remover. Precisa de `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` +
  `CLOUDINARY_API_SECRET` no `.env`; sem eles a tela de edição mostra aviso e
  some o upload (o resto do CRUD funciona). As fotos `picsum` do seed são
  descartáveis — o admin substitui.
- `/admin/config` edita `configuracoes` (`src/app/actions/config.ts` +
  `src/lib/config-schema.ts`).
- `.env`: `BETTER_AUTH_SECRET` (32+ chars de alta entropia — trocar invalida
  todas as sessões) e `BETTER_AUTH_URL` (origem pública da app, usada em
  callbacks/origin checks).
- Usuário admin: `admingaragem@gmail.com` (criado via `admin:create`, que roda
  `auth.api.signUpEmail` numa instância local do Better Auth sem
  `disableSignUp`). Fluxo verificado ponta a ponta com requests reais
  simulando o formulário (multipart, protocolo de Server Action do Next.js):
  login → cookie `better-auth.session_token` setado (`HttpOnly`, `SameSite=Lax`)
  → dashboard mostra o e-mail da sessão → `/admin/login` com sessão redireciona
  pro dashboard → logout limpa os 3 cookies do Better Auth e redireciona pro
  login → `/admin` sem sessão redireciona pro login (307).

**Tabelas** (nomes em pt-BR via `@@map`; modelos/campos em inglês para casar
com `src/types/vehicle.ts`):
1. `veiculos` — `Vehicle`: slug, brand, model, version, year, manufactureYear,
   price (R$ inteiros), mileage, fuel/transmission/body (enums), color, doors,
   plateEnd, featuredPosition (1/2/3 ou null, `@unique`, gerido em
   `/admin/destaques`), status, highlights (`Json`, array de string), features
   (`Json`, array de string), description, timestamps. MySQL não tem scalar
   list nativa no Prisma, por isso `highlights`/`features` são `Json` em vez de
   `String[]` - `src/lib/vehicles.ts` (`toVehicle`) e `src/lib/admin.ts`
   (`getVehicleForAdmin`) normalizam de volta pra `string[]` na leitura; na
   escrita (`saveVehicle`) o zod já produz `string[]`, que é atribuível direto
   num campo `Json`. Campos internos (placa, renavam, chassi, fipe, custo,
   notas) nunca vão ao site.
2. `veiculo_fotos` — `VehiclePhoto`: vehicleId, url, alt, position (capa = menor).
3. `leads` — `Lead`: kind (CONTATO/TROCA/INTERESSE/FINANCIAMENTO), name, phone,
   subject, message, tradeCar, tradeKm, vehicleId?, status.
4. `depoimentos` — `Testimonial`: quote, author, context, published, position.
5. `configuracoes` — `SiteConfig`: linha única (`id = "default"`). Lida por
   `getSiteConfig()` com fallback para `src/lib/site.ts`; editável em
   `/admin/config`.
6. `user` / `session` / `account` / `verification` — tabelas-núcleo do Better
   Auth (geradas por `npx auth generate`, ver "Auth / admin"). `account` guarda
   o hash da senha (`providerId: "credential"`); `session.token` é o que vira
   o cookie `better-auth.session_token`. Sem `@@map` pt-BR (nomes já vêm em
   minúsculo do gerador).

**Status:** migrations `init` (schema de veículos/leads/etc., MySQL) e
`add_better_auth` (tabelas do Better Auth) aplicadas na Aiven (MySQL 8.4.8).
As migrations Postgres antigas foram descartadas na migração de banco (SQL
Postgres não roda em MySQL; histórico reiniciado). `db:verify`: 6 enums
(colunas `ENUM` nativas, com acentuação preservada) + índices/FKs batendo com
o schema. Seed: 14 veículos, 89 fotos (picsum, dev), 4 depoimentos, 1 config -
conferido campo a campo, batendo com o Postgres original.
`db:test` / `tsc` / `eslint` / `next build` passam. `npm audit`: 0
vulnerabilidades.

Migrations futuras: `prisma migrate dev --name <x>` (usa `DATABASE_URL`).

## Pendências

1. **Fotos reais dos veículos**: o admin sobe pelo `PhotoManager`
   (`/admin/veiculos/[id]`); as `picsum` do seed são só demo, o admin substitui.
2. **Dados da loja**: `configuracoes` está seedada com os placeholders do
   `src/lib/site.ts`; o cliente/admin ajusta em `/admin/config`. Header/Hero e
   CTAs de client ainda leem `site.ts` — sincronizar os dois ou migrar via
   context depois.
3. **Fachada**: ainda usa `Placeholder` (não é foto de veículo). Trocar por
   `<Image>` quando o cliente enviar. O Hero já usa fotos reais
   (`public/images/tracker-hero.png` para telas ≥768px,
   `tracker-hero-mobile.png` abaixo disso via `<picture>` + `getImageProps`
   para não distorcer/cortar mal no mobile). O mapa em `VisitUs` já usa um
   embed real do Google Maps (`https://www.google.com/maps?q=<endereço>&output=embed`,
   sem API key) a partir do endereço em `site.address` /
   `configuracoes.addressStreet` etc; clicar leva ao `mapsUrl` (Google Maps em
   nova aba).
4. **Domínio**: `metadataBase` e `sitemap.ts` usam
   `https://beneventoveiculos.com.br` fixo.
5. **CRUD admin — próximos**: edição de `alt` da foto, status de lead
   (novo→fechado), `generateStaticParams`/ISR se quiser SSG parcial.
6. **Destaques da home**: recriados pelo seed na migração pro MySQL/Aiven
   (posições 1/2/3 = Tiggo 5X, Compass, Corolla). Se o admin trocar depois,
   usa `/admin/destaques` normalmente.

## Regras de manutenção

- Leitura de dados só pelos helpers `server-only` de `lib/` (nada de Prisma em
  Client Component). Escrita só por server actions guardadas com `requireUser`.
- Não criar novo valor de cor, radius ou fonte fora dos tokens de `globals.css`.
- Novo componente visual: arquivo próprio, nome espelhando o componente. Client
  só quando precisa de interação/motion; o resto é Server Component.
- Rodar `tsc --noEmit` + `eslint src` + `build` antes de fechar qualquer etapa.
- `AGENTS.md` tem o bloco de regras do Next 16 (re-adicionado pelo `next dev`);
  commitar junto para o diff ficar limpo.
