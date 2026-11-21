# Parecer de Conformidade — Tarefa 2

**Veredito:** APROVADO

Comando de diff: `git diff f26497ada64bf878fec08fe78e437b61bc0f2372`, aplicado ao trabalho que está no índice. Rodei `npm test` pelo PowerShell em `C:\Users\Gabriel\Desktop\munte_app`: 6 arquivos e 15 testes, todos passando, incluindo os 5 de `auth.service.spec.ts`.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA1, passo técnico: `solicitarLink('fulano@alunos.utfpr.edu.br')` faz `POST /magicLinks` com e-mail, token e `expiresAt` = agora + 1h, e devolve o link do callback | atendido | `apps/web/src/app/core/services/auth.service.ts:31-47`; teste em `auth.service.spec.ts:29-41`. O relógio é simulado em `2026-11-20T12:00Z` e o teste confere `expiresAt === '2026-11-20T13:00:00.000Z'`, o método POST e o retorno `/auth/callback?token=<token>` |
| CA3, parte do domínio: `@utfpr.edu.br`, `@gmail.com` e `@alunos.utfpr.edu.br.x.com` são rejeitados sem requisição | atendido | `auth.service.ts:33-35` e `48-51`, com igualdade exata do sufixo depois do último `@`; teste em `auth.service.spec.ts:53-62` (`rejects.toBeInstanceOf(EmailNaoPermitidoError)` + `http.expectNone(() => true)` + `http.verify()` no `afterEach`) |
| Fora de escopo: e-mails `@utfpr.edu.br` tratados como não permitidos | atendido | `auth.service.spec.ts:53` cobre esse caso |
| Assume que, premissa 1 (envio simulado, #25): exige `// TODO #25` | atendido | `auth.service.ts:28-29` |
| Assume que, premissa 2 (`magicLinks` no json-server, #25): exige `// TODO #25` | atendido | `auth.service.ts:28-29` e `core/config/api.config.ts:1`. A parte `localStorage` da premissa só entra com a sessão (Tarefa 7), então não cabe aqui |
| Contrato da coleção (`email, token, expiresAt, usedAt`) e `magicLinks: []` no `db.json` | atendido | `apps/api/db.json:1-3`; `auth.service.ts:9-15` e `37-42` (`usedAt: null`) |
| `provideHttpClient()` em `app.config.ts` | atendido | `apps/web/src/app/app.config.ts:11` |
| Não adiantar outras tarefas | atendido | Não há `confirmarLink`, sessão, guard, rotas nem tela. `withComponentInputBinding()` não entrou, o que está certo porque pertence à Tarefa 7. Os arquivos alterados são exatamente os que a Tarefa 2 prevê |

## Apontamentos

(nenhum)

## Observações (não bloqueiam, e nenhuma é falha deste diff)
- O teste de normalização (`auth.service.spec.ts:43-51`) não é um caso exigido no texto da Tarefa 2. Não é escopo inflado: o comportamento é a decisão técnica do plano para o `solicitarLink` ("normaliza (trim + minúsculas)", `plan.md:27`).
- O teste do CA1 não confere `usedAt: null` no corpo do POST, e a tarefa não exige isso. A implementação envia o campo (`auth.service.ts:41`). Se o usuário quiser o contrato coberto por teste, isso pode ser exigido na Tarefa 9.
- O `docs/architecture.md:192` (ID21) ainda diz "Somente e-mails institucionais @utfpr.edu.br", o que contradiz a spec e o PRD 1.3.0. O código segue a spec, que está correta. O documento deve ser ajustado no fechamento (Passo 4 do `utf-issue`), junto com a inclusão da coleção `magicLinks` no glossário e no ER, já prevista em `plan.md:41-42`.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\config\api.config.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.config.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\api\db.json
