# The history A&B — Design

Direção atual aprovada: mesclagem de roxo e azul-escuro em todo o site, preservando modernidade, elegância, layout, imagens e funcionalidades.

Galeria e linha do tempo pessoal, web responsiva, em português e sem login. Editorial afetivo e contemporâneo. Fotos, datas, títulos e textos editáveis, armazenados apenas neste navegador via IndexedDB. Nenhuma funcionalidade além da proposta aprovada.

## Brand & Colors

One token set, consumed per platform:

- **Web & desktop**: CSS variables in `packages/web/src/web/styles.css` (desktop loads the web UI).
- **Mobile**: `Colors.light` / `Colors.dark` in `packages/mobile/constants/theme.ts`, read via `useColors()`; `userInterfaceStyle: "automatic"` follows the system light/dark setting.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| primary | #7654D9 | #7654D9 | Buttons, active tab, accents |
| background | #0D1428 | #0D1428 | Navy foundation with deep purple ambient gradients |
| card | #1B2039 | #1B2039 | Navy-purple surfaces |
| foreground | #F0EDFA | #F0EDFA | Primary text |
| mutedForeground | #B5AFCB | #B5AFCB | Secondary text |
| border | #38334F | #38334F | Subtle violet hairlines |
| destructive | #A73354 | #A73354 | Delete / errors |

## Typography

Poppins 400, 500, 600, 700 para interface e títulos; Georgia itálica para acentos editoriais. Fontes locais em public/fonts. Base azul-marinho #0D1428 mesclada com roxo profundo #241936 em gradientes suaves. Sidebar escura, cartões azul-roxo, botões roxos com toques índigo. Texto branco-lavanda e secundários claros para contraste. Hero com fotografia original e sobreposição azul-roxa. Todos os estados, filtros, formulário, modal, exclusão e notificação seguem a mesma paleta. Sem alteração de estrutura ou dados.
Sidebar 240px, conteúdo com respiro de 44px, hero horizontal fotográfico e galeria em três colunas com alturas variadas. Bordas discretas, raios de 12–18px.

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
