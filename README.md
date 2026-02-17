# Ocorrencias (MVP)

Sistema web simples para registro de ocorrencias internas.

## Stack
- Next.js 14 (App Router)
- Prisma ORM + MongoDB
- NextAuth Credentials
- TailwindCSS

## Setup rapido
1. `npm install`
2. Copie `.env.example` para `.env` e preencha `DATABASE_URL`, `NEXTAUTH_URL` e `NEXTAUTH_SECRET`.
3. Gere um secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
4. `npm run prisma:generate`
5. `npm run prisma:push`
6. `npm run seed`
7. `npm run dev`

## MongoDB Atlas
- Crie um cluster e uma database.
- Gere um usuario com permissoes de leitura/escrita.
- Copie a string de conexao para `DATABASE_URL`.

## Credenciais seed
- Email: `admin@ocorrencias.local`
- Senha: `Admin#123`

Pode alterar via variaveis `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env`.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:generate`
- `npm run prisma:push`
- `npm run prisma:studio`
- `npm run seed`

## Checklist MVP
- [x] Login com email/senha
- [x] Protecao de rotas via middleware
- [x] CRUD de ocorrencias
- [x] Filtros e paginacao server-side
- [x] Dashboard com contadores
- [x] Seed de usuario admin

## Observacoes
- O filtro de datas usa UTC (T00:00:00Z a T23:59:59Z) para evitar inconsistencias de timezone.
- O dashboard usa dados do mes atual (criados e resolvidos).
