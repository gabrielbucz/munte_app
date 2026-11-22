# Parecer de Código: Tarefa 7

**Veredito:** APROVADO

Revisei com `git diff a6f4e6f073a5a7e03d9f73692a75796899884b8c` (diff inteiro lido) contra `c:\Users\Gabriel\Desktop\munte_app\docs\architecture.md`. Rodei os comandos pelo PowerShell com o drive em maiúsculo:
- `npm test`: 10 arquivos, 38 testes, todos passaram.
- `npm run lint`: nenhum erro.

O que verifiquei e está conforme:
- **Regra da camada de dados (seção 1) e regra imutável (seção 8):** os componentes `AuthCallback` e `Inicio` só falam com o `AuthService`. O `HttpClient` e o `localStorage` ficam só em `core/services/auth.service.ts`, então a migração para o Supabase continua mexendo só nessa camada.
- **Dependência entre pastas (seção 4):** `features/*` importa só de `core/*`. `core` não importa de `features`.
- **Sintaxe e padrões:** `inject()` em vez de construtor, `input()` para o token (ID17), `withComponentInputBinding()` em `app.config.ts` (ID16), `@if` no template (ID6), estado da sessão em `signal()` exposto com `asReadonly()` (ID10), rotas com `loadComponent`, nenhum `standalone: true`, nenhum CSS por componente.
- **Segredos e URLs:** nenhum segredo nem URL de ambiente no código. A URL base continua vindo de `core/config/api.config.ts`.
- **Comentários `TODO #25`:** estão nos dois pontos simulados (sessão no `localStorage` e conferência do link no json-server), como o plano pede.
- **Abstrações e duplicação:** nenhuma abstração para um caso só. Procurei outra leitura ou gravação de sessão no repositório e não há.
- **Testes de comportamento:** os testes do service conferem o contrato HTTP (GET com `token`, PATCH com `usedAt`), que a sessão só é gravada depois do PATCH, e que a sessão é relida quando o app abre de novo.

## Apontamentos (bloqueiam)

Nenhum.

## Sugestões (não bloqueiam)

- **Erro na confirmação deixa o aluno preso em "Aguarde".** Em `apps/web/src/app/features/auth/auth-callback/auth-callback.ts:16`, o `subscribe` só trata o caso de sucesso. Se o GET ou o PATCH falhar (rede fora, json-server fora, 5xx), o erro não é engolido: o RxJS o repassa e o `provideBrowserGlobalErrorListeners` registra no console. Mas a tela fica para sempre em "Aguarde enquanto conferimos o link". A tela Entrar já tem um padrão para isso (`subscribe({ next, error })` com `ErrorHandler` para erro inesperado, em `features/auth/login/login.ts:34-48`), e seria bom seguir o mesmo aqui. As Tarefas 9 e 10 vão tratar `'invalido'` e `'expirado'`, mas nenhuma tarefa cobre falha de rede no callback (veja as observações).
- **Valor corrompido no `localStorage` derruba o login.** Em `apps/web/src/app/core/services/auth.service.ts:93-96`, `lerSessao()` faz `JSON.parse` sem `try/catch` e sem conferir o formato. Se `munte.sessao` tiver um valor que não é JSON válido (edição manual, ou um formato antigo quando a US13 #23 mudar a sessão), o `AuthService` falha já na construção. Isso quebra Entrar, callback e Início juntos, e continua quebrado depois de recarregar a página, até alguém limpar o storage na mão. Hoje é pouco provável, por isso fica como sugestão.
- **O teste do callback depende do texto da tela Início.** Em `apps/web/src/app/features/auth/auth-callback/auth-callback.spec.ts:36-38`, o teste confere "Você entrou como ...", que já é provado em `inicio.spec.ts`. Assim, mudar o texto da Início quebra o teste do callback. Conferir `Router.url === '/inicio'` (linha 35) já prova a navegação.
- **O mock do `AuthService` vai precisar mudar na Tarefa 8.** O mesmo teste usa as rotas reais (`routes`), e o mock tem só `confirmarLink` e `sessao`. Quando a Tarefa 8 puser o `authGuard` em `/inicio` usando `autenticado()` (como o plano prevê), esse teste vai quebrar até o mock ganhar o membro novo. Melhor já esperar esse ajuste na Tarefa 8.
- **Token ausente ainda vai ao servidor.** Em `auth-callback.ts:16`, `this.token() ?? ''` faz a chamada mesmo sem token. Conferi no json-server 0.17.4 (`node_modules/json-server/lib/server/router/plural.js:108-128`): `?token=` vazio filtra por igualdade e devolve `[]`, então não há como entrar com o link de outra pessoa. Mesmo assim, encerrar antes de chamar a API deixa a intenção mais clara quando a Tarefa 9 tratar o link "incompleto".

## Observações fora do escopo deste diff

- **Lacuna da spec/plano, para triagem do usuário:** nenhum CA nem tarefa cobre falha de rede ou de servidor durante a confirmação do link (o CA6 cobre só o envio). Se a equipe quiser esse comportamento, precisa ser uma decisão explícita: um item na Tarefa 9 ou uma Issue nova, não uma mudança por conta do implementador.
- **Atomicidade:** o GET seguido de PATCH em `confirmarLink` não é atômico. Dois cliques quase simultâneos no mesmo link poderiam passar os dois. É uma limitação do json-server, que deve sumir com o Supabase Auth (#25). Fica só como nota.
- **Documentação:** `docs/architecture.md`, seção 4, ainda não lista `features/inicio/`. O plano já prevê essa atualização no fechamento da Issue.
