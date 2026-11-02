# Plano — Issue #00

## Decisões técnicas

- App Angular `munte-app` gerado via `ng new` dentro de `apps/web/`, standalone, com Tailwind CSS e PWA (`ng add @angular/pwa`).
- `package.json` na raiz com workspaces `apps/web` e `apps/api`, scripts de orquestração (`api`, `dev`, `test`, `test:ci`, `e2e`, `e2e:ci`, `lint`, `format`).
- json-server no MVP com `db.json = {}` e script `api` na porta 3001.
- Tokens de design (cores, espaçamento, tipografia, breakpoints, identidade PWA) aplicados a partir de `docs/design-tokens.md`.
- ESLint oficial no app; Prettier e `.editorconfig` na raiz.
- Template de PR com seção "O que este template faz e por quê"; etiqueta `manutencao` criada via MCP; `specs/README.md` criado.
- Portão = GitHub protection rules (configuração via GitHub settings, não código).

## Tarefas

- [ ] **Tarefa 1 — Criar branch chore/setup-projeto a partir da develop**
  - Cobre: CA1 (pré-requisito de todos os CAs)
  - Teste primeiro: `git branch --show-current` retorna `chore/setup-projeto`; `git log develop..HEAD` está vazio (branch recém-criada)
  - Arquivos previstos: nenhum (apenas git)

- [ ] **Tarefa 2 — Gerar app Angular munte-app em apps/web com Tailwind e PWA**
  - Cobre: CA1
  - Teste primeiro: `ng version` dentro de `apps/web/` mostra Angular 20+; `apps/web/angular.json` existe; `@angular/pwa` aparece em `package.json` do app; `ng build` ou `ng serve` não falha por falta de dependência
  - Arquivos previstos: `apps/web/package.json`, `apps/web/angular.json`, `apps/web/src/`, `apps/web/manifest.webmanifest`, `apps/web/ngsw-config.json`

- [ ] **Tarefa 3 — Configurar package.json da raiz com workspaces e scripts de orquestração**
  - Cobre: CA2
  - Teste primeiro: `npm run` na raiz lista os scripts `api`, `dev`, `test`, `test:ci`, `e2e`, `e2e:ci`, `lint`, `format`; `npm install` na raiz instala workspaces sem erro
  - Arquivos previstos: `package.json` (raiz), `package-lock.json` (raiz)

- [ ] **Tarefa 4 — Configurar json-server MVP com db.json vazio e script api**
  - Cobre: CA2
  - Teste primeiro: `npm run api` na raiz sobe json-server na porta 3001 sem erro; `apps/api/db.json` existe e é `{}`
  - Arquivos previstos: `apps/api/db.json`, `apps/api/README.md` (atualizado)

- [ ] **Tarefa 5 — Aplicar tokens de design (tema) a partir do design-tokens.md**
  - Cobre: CA3
  - Teste primeiro: arquivo CSS de tokens existe com variáveis `--bs-primary: #0066CC`, `--bs-body-bg: #F8FAFC`, etc.; `apps/web/src/styles.css` ou similar importa essas variáveis
  - Arquivos previstos: `apps/web/src/assets/css/design-tokens.css` (ou equivalente), `apps/web/src/styles.css`

- [ ] **Tarefa 6 — Configurar qualidade: ESLint, Prettier e .editorconfig**
  - Cobre: CA4
  - Teste primeiro: `npm run lint` na raiz responde sem erro; `.editorconfig` existe na raiz; `.prettierrc` existe na raiz ou no app
  - Arquivos previstos: `.editorconfig`, `.prettierrc`, `apps/web/eslint.config.js` (ou equivalente)

- [ ] **Tarefa 7 — Ferramentas do método: template de PR, etiqueta manutencao, specs/README.md**
  - Cobre: CA5
  - Teste primeiro: etiqueta `manutencao` existe em Issues → Labels no GitHub; `.github/pull_request_template.md` existe com seção "O que este template faz e por quê"; `specs/README.md` existe
  - Arquivos previstos: `.github/pull_request_template.md`, `specs/README.md`

- [ ] **Tarefa 8 — Prova de vida: rodar testes e lint pelos comandos da raiz**
  - Cobre: CA6
  - Teste primeiro: `npm run test:ci` termina verde; `npm run lint` termina verde
  - Arquivos previstos: nenhum novo (apenas executa comandos existentes)

## Critérios sem tarefa

-

---

> ⏸️ **PAUSA OBRIGATÓRIA:** Revise este `plan.md`. Se estiver de acordo, aprove e eu inicio a execução bloco a bloco via `/utf-task`, propondo cada commit antes de fazê-lo. Nenhum commit sai sem o seu ok explícito.