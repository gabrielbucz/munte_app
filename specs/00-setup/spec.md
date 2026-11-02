---
issue: 00
status: aprovado
---

# US00 — Setup do projeto Caronas UTFPR

## O problema

O repositório não possui scaffold do frontend Angular, nem scripts de orquestração na raiz, nem configuração de qualidade (ESLint, Prettier, editorconfig), nem fontes de dados MVP (json-server), nem infraestrutura do método (template de PR, etiqueta manutencao, specs/README.md). Tudo isso precisa existir antes de qualquer história de usuário ser implementada.

## A história

**Como** equipe de desenvolvimento, **eu quero** que o setup inicial do projeto esteja pronto e configurado **para que** possamos começar a implementar as features do app seguindo o método SDD com TDD, revisão dupla e Gitflow.

## Critérios de aceite

- [ ] **CA1 — Dado** que o setup foi executado, **quando** eu entrar na branch `chore/setup-projeto`, **então** o app Angular `munte-app` existe em `apps/web/` com Tailwind CSS e PWA configurado.
- [ ] **CA2 — Dado** a raiz do repositório, **quando** eu inspecionar `package.json`, **então** existem workspaces, scripts `api`, `dev`, `test`, `test:ci`, `e2e`, `e2e:ci`, `lint`, `format` conforme o `docs/architecture.md`.
- [ ] **CA3 — Dado** o bloco de tema, **quando** eu verificar os valores de cor, espaçamento e tipografia, **então** eles são os definidos em `docs/design-tokens.md` (atividade 05).
- [ ] **CA4 — Dado** o bloco de qualidade, **quando** eu rodar `npm run lint` na raiz, **então** o comando responde sem erro (ESLint oficial no app).
- [ ] **CA5 — Dado** o bloco de ferramentas do método, **quando** eu verificar no GitHub, **então** a etiqueta `manutencao` aparece em Issues → Labels.
- [ ] **CA6 — Dado** o bloco de prova de vida, **quando** eu rodar os testes e o lint pelos comandos da raiz, **então** tudo termina verde.

## Fora de escopo

- Não gera código de negócio (features de carona, auth, rides, etc.).
- Não migra para Supabase (fica apenas json-server no MVP).
- Não cria GitHub Actions / CI na nuvem (protection rules são configuradas via GitHub settings, não neste setup).

## Abandono no meio

Se o `ng new` falhar por falta de dependências globais (Angular CLI), o setup para e informa o que instalar antes de continuar. Nenhum commit é feito até que o problema seja resolvido e você autorize.

## Assume que

| Premissa | Issue que fecha |
|----------|-----------------|
| Angular CLI instalado globalmente (`npm install -g @angular/cli`) | — |
| `gh` CLI autenticado ou MCP do GitHub disponível | — |
| Branch `develop` existe e está atualizada localmente | — |

## Depende de

Nenhuma issue anterior. Este é o setup zero do repositório.

## Dúvidas em aberto

| # | Dúvida | Quem responde |
|---|--------|---------------|
|   |        |               |

---

> ⚠️ **PAUSA OBRIGATÓRIA:** Leia este `spec.md`, tire dúvidas e, quando estiver de acordo, troque `status: rascunho` por `status: aprovada` e faça o commit dessa linha na branch da história. Somente então o plano (`plan.md`) será criado.