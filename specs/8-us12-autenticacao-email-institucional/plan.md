# Plano — Issue #8

> Plano refeito após a reaprovação da spec (commit `850e18d`). O código do plano anterior foi
> desfeito no commit `75893ff` por ter sido implementado fora do ciclo `/utf-task`.

## Decisões técnicas

**Casca (App Shell)**
- O `App` (`app.ts`) passa a usar `templateUrl: './app.html'` (hoje o template é inline e o `app.html` está órfão). O `app.css` vazio é removido: a regra `01-angular-strict-rules` proíbe CSS por componente.
- `app.html` = `<app-header />` + `<main>` com `<router-outlet />` (palco central) + `<app-footer />`. Altura total da janela com `min-h-screen flex flex-col` e `flex-1` no `<main>`, para o rodapé ficar no fim.
- Componentes em `shared/components/` (burros, sem `core/`): `header/` (`header.ts`, `header.html`, `header.spec.ts`, classe `Header`) e `footer/` (idem, classe `Footer`).
- O `Header` contém a barra superior (desktop, opção A), o botão ☰ e a gaveta (mobile). Estado da gaveta: `menuAberto = signal(false)`. Os links vêm de uma lista única (`links = [{ rotulo: 'Entrar', caminho: '/entrar' }]`) renderizada com `@for ... track` na barra e na gaveta.
- O `app.spec.ts` gerado pelo CLI confere "Tema do projeto" e vai falhar quando a casca entrar: é **atualizado** na Tarefa 1, não apagado.

**Rotas (`app.routes.ts`, lazy com `loadComponent`)**
- `''` → redireciona para `inicio`.
- `entrar` → `features/auth/login/login.ts` (classe `Login`).
- `auth/callback` → `features/auth/auth-callback/auth-callback.ts` (classe `AuthCallback`); recebe `token` da query string como `input()`, via `withComponentInputBinding()` (ID16/ID17).
- `inicio` → `features/inicio/inicio.ts` (classe `Inicio`), com `canActivate: [authGuard]`.
- `app.config.ts` ganha `provideHttpClient()` e `withComponentInputBinding()`.

**Dados (json-server, porta 3001)**
- `apps/api/db.json` ganha a coleção `magicLinks: []`. Contrato: `{ id, email, token, expiresAt (ISO), usedAt (ISO | null) }`.
- URL base em `core/config/api.config.ts` (`API_URL = 'http://localhost:3001'`).

**AuthService (`core/services/auth.service.ts`, `providedIn: 'root'`, `inject(HttpClient)`)**
- `solicitarLink(email)`: normaliza (trim + minúsculas), valida o domínio com igualdade exata a `@alunos.utfpr.edu.br` (rejeita `@utfpr.edu.br` e sufixos falsos como `@alunos.utfpr.edu.br.x.com`) **sem chamar a API**; se válido, gera `token` (`crypto.randomUUID()`), grava `POST /magicLinks` com `expiresAt = agora + 1h` e devolve o link `/auth/callback?token=<token>`.
- `confirmarLink(token)`: `GET /magicLinks?token=<token>`; resultado `'valido' | 'invalido' | 'expirado'`. Inválido = inexistente ou já usado (`usedAt` preenchido). Expirado = `expiresAt` no passado. Se válido: `PATCH usedAt`, grava a sessão.
- Sessão: `sessao = signal<Sessao | null>`, lida e gravada no `localStorage` (chave `munte.sessao`, `{ email }`), e `autenticado = computed(() => sessao() !== null)` (ID10). Validade da sessão é da US13 (#23).
- Comentários `// TODO #25` no `AuthService` (envio simulado e armazenamento no json-server/localStorage) e no quadro "E-mail simulado" da tela Entrar.

**Guard (`core/guards/auth.guard.ts`)**
- Funcional (`CanActivateFn`), com `inject()`: autenticado → `true`; senão → `UrlTree` para `/entrar` (ID19).

**Textos de interface**
- CA3: "e-mail não permitido ou link inválido" (texto da spec).
- CA6: "Não foi possível enviar o link. Verifique sua conexão e tente novamente." + botão "Tentar novamente"; o e-mail digitado é mantido.
- CA4: a mensagem do CA3 + link "Solicitar novo link" para `/entrar`.
- Início: "Você entrou como <e-mail>".

**Documentação a atualizar no fechamento (Passo 4 do `utf-issue`)**
- `docs/architecture.md`: coleção `magicLinks` na seção 8 e no ER; pasta `features/inicio/` na seção 4.

## Tarefas

- [x] **Tarefa 1 — montar a casca com cabeçalho, palco central e rodapé**
  - Cobre: CA7
  - Teste primeiro: `app.spec.ts` (atualizado) prova que o `App` renderiza `app-header`, depois um `<main>` contendo o componente da rota ativa (rota de teste via `provideRouter`), depois `app-footer`; `header.spec.ts` prova que a barra superior mostra o link "Entrar". Falha antes porque o `App` ainda é a vitrine dos tokens, sem `<router-outlet>`.
  - Arquivos previstos: `apps/web/src/app/app.ts`, `app.html`, `app.css` (removido), `app.spec.ts`, `shared/components/header/header.{ts,html,spec.ts}`, `shared/components/footer/footer.{ts,html,spec.ts}`

- [x] **Tarefa 2 — criar o AuthService que valida o domínio e grava o link no json-server**
  - Cobre: CA1 (passo técnico que destrava a Tarefa 3)
  - Teste primeiro: `auth.service.spec.ts` com `provideHttpClientTesting()` prova que `solicitarLink('fulano@alunos.utfpr.edu.br')` faz `POST /magicLinks` com e-mail, token e `expiresAt` = agora + 1h e devolve o link do callback; e que `@utfpr.edu.br`, `@gmail.com` e `@alunos.utfpr.edu.br.x.com` são rejeitados **sem** requisição. Falha antes porque o service não existe.
  - Arquivos previstos: `core/services/auth.service.{ts,spec.ts}`, `core/config/api.config.ts`, `app.config.ts`, `apps/api/db.json`

- [ ] **Tarefa 3 — criar a tela Entrar que solicita o link e exibe o "E-mail simulado"**
  - Cobre: CA1
  - Teste primeiro: `login.spec.ts` prova que, ao submeter um e-mail `@alunos.utfpr.edu.br`, a tela chama `solicitarLink` e exibe o quadro "E-mail simulado" com o link clicável; e que o botão fica desabilitado com o campo vazio ou fora do formato de e-mail. Falha antes porque a tela e a rota `/entrar` não existem.
  - Arquivos previstos: `features/auth/login/login.{ts,html,spec.ts}`, `app.routes.ts`

- [ ] **Tarefa 4 — abrir e fechar a gaveta de navegação no mobile**
  - Cobre: CA8, CA9
  - Teste primeiro: `header.spec.ts` prova que, com a gaveta fechada, tocar no ☰ abre a gaveta e mostra o link "Entrar"; e que tocar em "Entrar" fecha a gaveta e navega para `/entrar`. Falha antes porque o ☰ e o signal `menuAberto` não existem.
  - Arquivos previstos: `shared/components/header/header.{ts,html,spec.ts}`

- [ ] **Tarefa 5 — bloquear e-mail não institucional na tela Entrar**
  - Cobre: CA3 (parte do e-mail)
  - Teste primeiro: `login.spec.ts` prova que, ao submeter `fulano@gmail.com` ou `fulano@utfpr.edu.br`, a tela exibe "e-mail não permitido ou link inválido" e não mostra o quadro "E-mail simulado". Falha antes porque a tela ainda não trata a rejeição do service.
  - Arquivos previstos: `features/auth/login/login.{ts,html,spec.ts}`

- [ ] **Tarefa 6 — informar falha de rede e permitir nova tentativa**
  - Cobre: CA6
  - Teste primeiro: `login.spec.ts` prova que, quando `solicitarLink` falha por erro de rede, a tela exibe a mensagem de falha e o botão "Tentar novamente", mantém o e-mail digitado e, ao tentar de novo com sucesso, exibe o quadro "E-mail simulado". Falha antes porque o erro não é tratado.
  - Arquivos previstos: `features/auth/login/login.{ts,html,spec.ts}`, `core/services/auth.service.{ts,spec.ts}` (propagação do erro, se necessário)

- [ ] **Tarefa 7 — confirmar o link válido e levar o aluno à tela Início**
  - Cobre: CA2
  - Teste primeiro: `auth.service.spec.ts` prova que `confirmarLink` com token existente, não usado e dentro do prazo faz `PATCH usedAt`, grava a sessão e retorna `'valido'`; `auth-callback.spec.ts` prova que o callback com esse token navega para `/inicio`; `inicio.spec.ts` prova que a tela mostra "Você entrou como <e-mail>". Falha antes porque `confirmarLink`, o callback e a Início não existem.
  - Arquivos previstos: `core/services/auth.service.{ts,spec.ts}`, `features/auth/auth-callback/auth-callback.{ts,html,spec.ts}`, `features/inicio/inicio.{ts,html,spec.ts}`, `app.routes.ts`, `app.config.ts`

- [ ] **Tarefa 8 — proteger a tela Início com o authGuard**
  - Cobre: CA2 (sem sessão, a Início não é exibida), CA3 (bloqueia o acesso)
  - Teste primeiro: `auth.guard.spec.ts` prova que, com sessão, o guard retorna `true`; sem sessão, retorna um `UrlTree` para `/entrar`. Falha antes porque o guard não existe.
  - Arquivos previstos: `core/guards/auth.guard.{ts,spec.ts}`, `app.routes.ts`

- [ ] **Tarefa 9 — bloquear link inválido ou já usado**
  - Cobre: CA3 (parte do link)
  - Teste primeiro: `auth.service.spec.ts` prova que `confirmarLink` retorna `'invalido'` para token inexistente e para token com `usedAt` preenchido, sem gravar sessão; `auth-callback.spec.ts` prova que a tela exibe "e-mail não permitido ou link inválido" e não navega. Falha antes porque esses casos não são tratados.
  - Arquivos previstos: `core/services/auth.service.{ts,spec.ts}`, `features/auth/auth-callback/auth-callback.{ts,html,spec.ts}`

- [ ] **Tarefa 10 — bloquear link expirado e oferecer um novo link**
  - Cobre: CA4
  - Teste primeiro: `auth.service.spec.ts` (com relógio simulado) prova que um token com `expiresAt` no passado retorna `'expirado'` sem gravar sessão; `auth-callback.spec.ts` prova que a tela exibe a mensagem de bloqueio e o link "Solicitar novo link" para `/entrar`. Falha antes porque a validade não é conferida.
  - Arquivos previstos: `core/services/auth.service.{ts,spec.ts}`, `features/auth/auth-callback/auth-callback.{ts,html,spec.ts}`

## Critérios sem tarefa

<!-- Precisa ficar vazio. Se sobrou critério aqui, falta tarefa. -->

