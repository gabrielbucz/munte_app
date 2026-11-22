# Parecer de Código — Tarefa 9

**Veredito:** APROVADO

Diff revisado: `git diff 21dd4490c81f92b0abc645ba4b12431e39432772 -- apps`, com 5 arquivos no índice. Rodei os testes e o lint pelo PowerShell, com o drive em maiúsculo. `npm test` passou: 11 arquivos, 47 testes, nenhuma falha. `npm run lint` (eslint) também passou, sem nenhum aviso.

O diff respeita a régua do `docs/architecture.md`:
- **Camada de dados:** a regra de inválido (token inexistente ou `usedAt` preenchido) mora em `core/services/auth.service.ts`. O componente só reage ao `ResultadoDaConfirmacao` e não toca em HTTP.
- **Regra de dependência:** `features/` importa só de `core/`.
- **Estado:** fica no novo `protected readonly linkInvalido = signal(false)`. O template usa `@if` / `@else` (ID6) e tokens do Tailwind (`text-perigo`, `text-texto`), sem CSS no componente.
- **Sem segredo nem URL fixa:** continua usando o `API_URL` que já existia.
- **Nenhum erro engolido** pelo código novo. O `of('invalido')` é um resultado de domínio, não uma falha mascarada.
- **Testes do service:** checam o comportamento visível (valor devolvido, nenhuma requisição extra com `expectNone`, sessão nula no signal e no `localStorage`).
- **Teste do componente:** checa o texto exato do alerta e a URL que não mudou. Não depende de detalhe interno.

## Apontamentos (bloqueiam)
Nenhum.

## Sugestões (não bloqueiam)
- **Texto do CA3 repetido em dois templates.** "e-mail não permitido ou link inválido" agora está em `apps/web/src/app/features/auth/login/login.html:26` e em `apps/web/src/app/features/auth/auth-callback/auth-callback.html:5`. Também aparece fixo em dois specs (`login.spec.ts:17`, `auth-callback.spec.ts:53`). O parecer da Tarefa 5 (`reviews/tarefa-05-codigo-r1.md:27`) já previa centralizar quando o callback passasse a usar o texto. Não reprovo: são dois usos, ambos cobertos por teste com o texto exato. O risco concreto é pequeno: se a spec mudar o texto, alguém atualiza um template e o teste dele, e o outro fica com o texto antigo sem nenhum teste falhar. A Tarefa 10 (CA4) vai reusar o mesmo texto, então é uma boa hora para decidir.
- **Token ausente ainda chama a API.** Em `auth-callback.ts:18`, `this.token() ?? ''` dispara um `GET /magicLinks?token=`. Hoje isso dá `'invalido'` só porque o json-server 0.17.4 devolve `[]` para filtro vazio (conferido no parecer da Tarefa 7). Um `if (!token) return of('invalido')` no começo de `confirmarLink` (`auth.service.ts:72`) tiraria essa dependência do comportamento do json-server. O comentário da linha 75 já fala em link "incompleto", mas nenhum teste cobre o caso `/auth/callback` sem `token`. Se esse caso conta como requisito, quem decide é a conformidade e o usuário.
- **Título "Acesso bloqueado"** (`auth-callback.html:3`): esse texto não está na seção "Textos de interface" do `plan.md`, linhas 35 a 39. Não é questão de arquitetura. Registro só para a triagem de conformidade.
- **Repetição no `auth.service.spec.ts`.** O predicado do GET (`req.method === 'GET' && req.url === ... && req.params.get('token') === ...`) aparece três vezes (linhas 118-123, 143-148 e 160-166). Uma função auxiliar `esperarBusca(token)` encurtaria os testes. É só estilo.
- **Ramo de `auth-callback.ts:19-26`:** com `return` mais um segundo `if`, um `else if` deixaria mais claro que os dois ramos se excluem. É só estilo.

## Observações fora do escopo deste diff
- **Falha de HTTP na confirmação trava a tela.** Em `auth-callback.ts:18`, o `subscribe` não tem callback de erro (código da Tarefa 7). Se o GET ou o PATCH falhar (rede ou 500), a tela fica para sempre em "Confirmando seu acesso" e o erro só chega ao `ErrorHandler` global. O parecer da Tarefa 7 já apontou isso como lacuna da spec, e não há `tarefa-07-decisoes` registrando uma decisão. Candidata a Issue de manutenção, ou a uma decisão explícita do usuário.
- **Corrida no "já usado".** Duas confirmações quase simultâneas do mesmo token podem ler `usedAt: null` e criar duas sessões, porque o GET e o PATCH são separados no json-server. Isso é inerente à fase MVP e some com o Supabase Auth (TODO #25). Não precisa de ação agora, só deixo registrado.
- **Link expirado:** o resultado `'expirado'` existe no tipo, mas o service ainda não confere o `expiresAt`. Com isso, um link expirado hoje é aceito como válido, e o componente não trata `'expirado'`. O plano já atribui isso à Tarefa 10, então não é falha desta tarefa.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.spec.ts

Este parecer precisa ser gravado sem edição em `c:\Users\Gabriel\Desktop\munte_app\specs\8-us12-autenticacao-email-institucional\reviews\tarefa-09-codigo-r1.md`. Eu não gravei porque sou somente leitura.
