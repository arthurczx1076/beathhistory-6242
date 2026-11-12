# The history A&B — Design

> Starter design brief. Replace this content with the app you're building before writing any UI.
> Keep it short and concrete — it's the single source of truth for palette, typography, pages,
> screens, and flows across web, mobile, and desktop.

Galeria e linha do tempo pessoal, web responsiva, em português e sem login. Editorial afetivo e contemporâneo. Fotos, datas, títulos e textos editáveis, armazenados apenas neste navegador via IndexedDB. Nenhuma funcionalidade além da proposta aprovada.

## Brand & Colors

One token set, consumed per platform:

- **Web & desktop**: CSS variables in `packages/web/src/web/styles.css` (desktop loads the web UI).
- **Mobile**: `Colors.light` / `Colors.dark` in `packages/mobile/constants/theme.ts`, read via `useColors()`; `userInterfaceStyle: "automatic"` follows the system light/dark setting.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| primary | #5344BF | #5344BF | Buttons, active tab, accents |
| background | #FAF9FE | #FAF9FE | Page/screen background |
| card | #FFFFFF | #1A1A1A | Cards, surfaces |
| foreground | #171717 | #FAFAFA | Primary text |
| mutedForeground | #737373 | #A3A3A3 | Secondary text |
| border | #E5E5E5 | #262626 | Hairlines |
| destructive | #DC2626 | #EF4444 | Delete / errors |

## Typography

Poppins 400, 500, 600, 700 para interface e títulos; Georgia itálica para acentos editoriais. Fontes locais em public/fonts. Azul índigo e roxo pontuais sobre branco-lavanda. Sidebar 240px, conteúdo com respiro de 44px, hero horizontal fotográfico escuro e galeria em três colunas com alturas variadas. Bordas discretas, raios de 12–18px.

## Pages & Screens

List each page/screen, its route file, and what it shows. Example:

- **Web — Home** (`packages/web/src/web/pages/index.tsx`) — what the user sees first.
- **Mobile — Home** (`packages/mobile/app/(tabs)/index.tsx`) — main tab.
- Add web pages under `src/web/pages/` (+ route in `app.tsx`); mobile tabs under `app/(tabs)/`, stack/modal screens under `app/`.

## Key User Flows

1. Galeria e linha do tempo em pages/index.tsx; mesma coleção em ambas, pesquisa por texto, filtro por ano e ordenação.
2. Adicionar memória → modal com foto opcional, título, data e texto → salvar no IndexedDB. Prévia e compressão de fotos no navegador.
3. Abrir memória → editar ou excluir com confirmação. Modal com foco contido e Escape. Estados vazio, carregamento, erro e sucesso. Exemplos explicitamente identificados, sem representar dados reais do usuário.

## Architecture

- **API**: typed oRPC client (`lib/api.ts` in each package) → the backend in `@template/web`. Query/mutation hooks live in `queries/` (one file per feature); pages/screens call them with `@tanstack/react-query`.
- **State/sync**: React e IndexedDB local, sem API, autenticação ou tabelas remotas para fotos pessoais. lib/memories.ts guarda a coleção em uma transação. components/memory-modal.tsx contém formulário e visualização.
- **Auth / payments / uploads**: see `skills/app/references/` when those features are needed.
