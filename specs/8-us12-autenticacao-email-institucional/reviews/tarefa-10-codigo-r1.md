# Parecer de Código: Tarefa 10

**Veredito:** APROVADO

Diff revisado: `git diff 8c792034bfd585a9a482e855cee2e8671415fe81 -- apps`. São 5 arquivos no índice, todos previstos no plano, e li o diff inteiro. Comparei com `c:\Users\Gabriel\Desktop\munte_app\docs\architecture.md`. Rodei os comandos pelo PowerShell com o drive em maiúsculo:
- `npm test`: 11 arquivos e 51 testes passaram, nenhuma falha. Os avisos `ExperimentalWarning: localStorage...` vêm do Node e não afetam o resultado.
- `npm run lint` (eslint): passou sem nenhum aviso.

O que conferi e está conforme:
- **Regra da camada de dados (Seção 1 e Seção 8):** a regra de validade (`expiresAt` comparado com o relógio) fica só em `core/services/auth.service.ts:80-82`. O componente só reage ao `ResultadoDaConfirmacao` e não toca em HTTP nem em data. Quando o projeto migrar para o Supabase, essa mudança continua presa ao service.
- **Regra de dependência (Seção 4):** `features/auth/auth-callback` importa de `core/` (`AuthService` e o tipo `ResultadoDaConfirmacao`) e de `@angular/router`. Nada mais.
- **Signals, Control Flow, DI e standalone (Seção 1, ID4, ID6, ID10, ID15):**
  - O estado está em `signal<Exclude<ResultadoDaConfirmacao, 'valido'> | null>`.
  - O template usa `@if (...; as motivo)` com um `@if` aninhado.
  - A injeção é por `inject()`.
  - O componente usa `imports: [RouterLink]` e não declara `standalone: true`.
  - O tipo `Exclude<...>` faz o compilador cobrir qualquer resultado novo que entrar no tipo, sem precisar de um `if` por caso. A troca de `linkInvalido` (boolean) por `bloqueio` (motivo) não é indireção à toa: ela carrega a informação que o template usa.
- **Tailwind e tokens (ID5):** as classes do link usam tokens que existem em `apps/web/src/styles.css:6,42` (`text-primaria`, `hover:text-primaria-hover`, `ring-primaria/25`). É o mesmo padrão de link de `features/auth/login/login.html:61-62`. Não há CSS no componente nem valor fixo.
- **Sem segredo nem URL fixa:** o código continua usando o `API_URL` que já existia. A rota `/entrar` é uma rota interna.
- **Erro engolido:** nenhum no código novo. O `of('expirado')` é um resultado de domínio, não uma falha escondida.
- **Duplicação:** procurei outro ponto que compare `expiresAt` ou validade e não há. `VALIDADE_DO_LINK_MS` só é usado na criação do link.
- **Testes (comportamento, não implementação):**
  - **Service:** com o relógio simulado, o teste confere o resultado devolvido, que não houve PATCH (`expectNone`) e que a sessão continua nula no signal e no `localStorage`. Ele também cobre a fronteira exata (`expiresAt === agora` ainda vale) e a precedência entre usado e vencido.
  - **Componente:** o teste acha o link pelo texto visível, confere o `href` e clica nele para provar que a navegação chega a `/entrar`. Uma refatoração interna não quebra nenhum dos dois.

## Apontamentos (bloqueiam)
Nenhum.

## Sugestões (não bloqueiam)
- **A validade deixa passar um `expiresAt` malformado** (`apps/web/src/app/core/services/auth.service.ts:80`). Se o registro vier com `expiresAt` ausente ou mal formado, `new Date(...).getTime()` dá `NaN`. Como `NaN < Date.now()` é `false`, o link é tratado como válido e nunca expira. Hoje o único escritor da coleção é o próprio `solicitarLink`, que sempre grava uma ISO válida, por isso não reprovo. Inverter a condição evita o problema: aceitar só quando `Date.now() <= expiresAt` (ou tratar `NaN` como expirado). Assim o defeito de dado bloqueia o link em vez de liberá-lo.
- **O comentário repete a regra de negócio** (`auth.service.ts:79`). "a validade de 1 hora já passou" duplica o valor de `VALIDADE_DO_LINK_MS` (linha 7). Se a validade mudar, o comentário fica errado sem ninguém perceber. "a validade (`expiresAt`) já passou" basta.
- **Precedência usado/vencido é decisão de produto** (`auth.service.spec.ts:212-233`). O teste fixa que um link usado e vencido devolve `'invalido'`, então a tela não mostra "Solicitar novo link". Do lado do código está bem testado e documentado no comentário. Se essa ordem combina com a spec é questão do revisor de conformidade, e eu só registro.
- **Mantenho as sugestões das rodadas anteriores que o usuário não promoveu**, sem reabrir:
  - O texto do CA3 agora aparece em três asserções de spec e dois templates (`login.html`, `auth-callback.html`).
  - `this.token() ?? ''` ainda chama a API sem token (`auth-callback.ts:19`).

## Observações fora do escopo deste diff
- **Falha de HTTP trava a tela** (código da Tarefa 7, já registrado em `tarefa-07-codigo-r1.md` e `tarefa-09-codigo-r2.md`). O `subscribe` em `auth-callback.ts:19` continua sem callback de erro, e este diff só mexeu no ramo de sucesso. Se o GET ou o PATCH falhar, a tela fica para sempre em "Confirmando seu acesso". Isso continua candidato a Issue de manutenção ou a uma decisão explícita do usuário.
- **Corrida entre o GET e o PATCH** no json-server: duas confirmações quase simultâneas do mesmo token podem criar duas sessões. É uma limitação do MVP e some com o Supabase Auth (TODO #25).
- **Relógio do cliente:** a expiração é conferida com o `Date.now()` do navegador, então quem adiantar ou atrasar o relógio local contorna a regra. É próprio da simulação no json-server. Com o Supabase Auth (#25), a validade passa a ser conferida no servidor.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.spec.ts

Este parecer precisa ser gravado sem edição em `c:\Users\Gabriel\Desktop\munte_app\specs\8-us12-autenticacao-email-institucional\reviews\tarefa-10-codigo-r1.md`. Ainda não existe nenhum arquivo da tarefa 10 em `reviews/`, então esta é a rodada 1. Não gravei o arquivo porque sou somente leitura.
