<!-- 📐 MODELO — não é um plano de verdade, e por isso mora em `docs/`, e não em `specs/`.
     O `/utf-issue <n>` gera `specs/<numero-da-issue>-<slug>/plan.md` com esta forma,
     depois de você aprovar a spec. O `/utf-task` lê as caixas `- [ ]` daqui para saber
     qual é a próxima tarefa, e marca `- [x]` quando você autoriza o commit. -->

# Plano — Issue #8

## Decisões técnicas

- AuthService em `core/services/auth.service.ts` encapsula `supabase.auth`: `signInWithOtp({ email })` para envio do link, `verifyOtp` para validação do link de confirmação, `getSession()` e `onAuthStateChange()`.
- Validação de domínio `@utfpr.edu.br` no service antes de chamar o BaaS; e-mails fora do domínio são rejeitados localmente (CA3).
- Rota `/auth/callback` (ou equivalente) recebe o token do link de confirmação e estabelece a sessão JWT (CA2).
- `authGuard` funcional protege rotas da aplicação; redireciona para login quando não autenticado (arquitetura ID19).
- Formulário reativo com `FormBuilder` + `Validators.email` e `Validators.required` na tela de login (arquitetura ID24).
- `authInterceptor` injeta o token JWT nas requisições (arquitetura ID23).

## Tarefas

- [x] **Tarefa 1 — criar AuthService com validação de domínio e requestMagicLink**
  - Cobre: CA1
  - Teste primeiro: unit test `.spec.ts` que prova que `requestMagicLink('aluno@utfpr.edu.br')` chama o BaaS e que `requestMagicLink('x@gmail.com')` lança erro de domínio não permitido (RED antes do código).
  - Arquivos previstos: `apps/web/src/app/core/services/auth.service.ts`, `apps/web/src/app/core/services/auth.service.spec.ts`

- [x] **Tarefa 2 — tela de login com envio de link de confirmação (CA1)**
  - Cobre: CA1
  - Teste primeiro: teste de integração/componente que prova que submeter e-mail institucional chama `requestMagicLink` e exibe "link enviado"; e-mail inválido não chama o service.
  - Arquivos previstos: `apps/web/src/app/features/auth/login/login.component.ts`, `apps/web/src/app/features/auth/login/login.component.html`, `apps/web/src/app/features/auth/login/login.component.spec.ts`

- [x] **Tarefa 3 — rota/callback de validação do link de confirmação (CA2)**
  - Cobre: CA2
  - Teste primeiro: unit test que prova que um token válido dentro do prazo de 1h estabelece sessão (`getSession()` autenticado) e token expirado/inválido não estabelece (RED).
  - Arquivos previstos: `apps/web/src/app/features/auth/auth-callback/auth-callback.component.ts`, rotas em `app.routes.ts`

- [x] **Tarefa 4 — authGuard que bloqueia acesso sem sessão (CA2)**
  - Cobre: CA2
  - Teste primeiro: unit test do guard que prova `true` com sessão ativa e `redirectToLogin` sem sessão (RED).
  - Arquivos previstos: `apps/web/src/app/core/guards/auth.guard.ts`, `apps/web/src/app/core/guards/auth.guard.spec.ts`

- [ ] **Tarefa 5 — bloqueio e mensagem de erro para e-mail não institucional ou link expirado/inválido (CA3)**
  - Cobre: CA3
  - Teste primeiro: teste que prova exibição de "e-mail não permitido ou link inválido" e bloqueio de acesso para domínio fora de `@utfpr.edu.br` e token expirado (RED).
  - Arquivos previstos: `apps/web/src/app/core/services/auth.service.ts`, `apps/web/src/app/features/auth/login/login.component.ts`, `apps/web/src/app/features/auth/auth-callback/auth-callback.component.ts`

## Critérios sem tarefa

<!-- Precisa ficar vazio. Se sobrou critério aqui, falta tarefa. -->

-
