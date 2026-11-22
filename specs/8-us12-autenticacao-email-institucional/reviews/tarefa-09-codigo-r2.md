# Parecer de Código — Tarefa 9 (rodada 2)

**Veredito:** APROVADO

Diff revisado: `git diff 21dd4490c81f92b0abc645ba4b12431e39432772 -- apps`, com 5 arquivos no índice. Rodei os testes e o lint pelo PowerShell, com o drive em maiúsculo:
- `npm test`: 11 arquivos e 47 testes passaram, nenhuma falha. Os avisos `ExperimentalWarning: localStorage...` vêm do Node e não afetam o resultado.
- `npm run lint` (eslint): passou sem nenhum aviso.

O que mudou desde a r1: só o item aceito em `tarefa-09-decisoes-r1.md`. O título "Acesso bloqueado" saiu de `auth-callback.html`, e o spec do componente ganhou `expect(...textContent).not.toContain('Acesso bloqueado')` (`auth-callback.spec.ts:54`). O service ficou igual ao que foi aprovado na r1.

Conferi o diff contra o `docs/architecture.md`:
- **Data Layer Rule (Seção 1 e Seção 8):** a regra de link inválido (token inexistente ou `usedAt` preenchido) fica em `core/services/auth.service.ts:76`. O componente só reage ao `ResultadoDaConfirmacao` e não toca em HTTP.
- **Regra de dependência (Seção 4):** `features/auth/auth-callback` importa só de `core/`.
- **Signals, Control Flow e DI (Seção 1, ID6, ID10, ID15):** o estado está em `protected readonly linkInvalido = signal(false)`, o template usa `@if` / `@else` e a injeção é por `inject()`.
- **Tailwind e tokens (ID5):** o template usa as classes dos tokens (`text-perigo`, `text-texto`, `text-texto-suave`) e não tem CSS no componente.
- **Sem segredo nem URL fixa:** continua usando o `API_URL` que já existia.
- **Erro engolido:** nenhum no código novo. O `of('invalido')` é um resultado de domínio, não uma falha escondida.
- **Testes:** checam comportamento visível. No service: o valor devolvido, `expectNone` para provar que não houve PATCH, e a sessão nula no signal e no `localStorage`. No componente: o texto exato do `role="alert"` e a URL que não mudou.

## Apontamentos (bloqueiam)
Nenhum.

## Sugestões (não bloqueiam)
- **A asserção negativa contra "Acesso bloqueado" protege pouco** (`auth-callback.spec.ts:54`). Ela trava só a volta dessa frase exata. Se aparecer outro título ou texto que não está na spec, o teste não pega. Isso não quebra em refatoração, então não reprovo. Uma checagem mais firme seria comparar o `textContent` inteiro da `<section>` com a mensagem esperada.
- **No estado inválido, a tela fica sem heading.** Com o `<h1>` removido, o ramo `@if (linkInvalido())` em `auth-callback.html:2-5` tem só o `<p role="alert">`. A acessibilidade não é cobrada pelo `architecture.md`, e a remoção foi decisão do usuário (só os textos da spec). Deixo registrado para o caso de a spec ganhar um título depois.
- **Mantenho as sugestões da r1 que o usuário não promoveu**, sem reabrir:
  - Texto do CA3 repetido: está em `features/auth/login/login.html:26` e em `features/auth/auth-callback/auth-callback.html:4`, e de novo fixo nos dois specs. A Tarefa 10 vai reusar o mesmo texto.
  - Token ausente: `this.token() ?? ''` ainda chama `GET /magicLinks?token=` (`auth-callback.ts:18`). O resultado só dá `'invalido'` porque o json-server devolve `[]` nesse caso.

## Observações fora do escopo deste diff
- **Falha de HTTP trava a tela** (código da Tarefa 7). O `subscribe` em `auth-callback.ts:18` não tem callback de erro. Se o GET ou o PATCH falhar, a tela fica para sempre em "Confirmando seu acesso". Candidata a Issue de manutenção, ou a uma decisão explícita do usuário.
- **Corrida no "já usado":** o GET e o PATCH são separados no json-server, então duas confirmações quase simultâneas do mesmo token podem criar duas sessões. Isso é próprio da fase MVP e some com o Supabase Auth (TODO #25).
- **`'expirado'`** existe no tipo, mas o service ainda não confere o `expiresAt`. O plano atribui isso à Tarefa 10.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.spec.ts

Este parecer precisa ser gravado sem edição em `c:\Users\Gabriel\Desktop\munte_app\specs\8-us12-autenticacao-email-institucional\reviews\tarefa-09-codigo-r2.md`. Não gravei porque sou somente leitura.
