# Parecer de Conformidade — Tarefa 10

**Veredito:** APROVADO

A Tarefa 10 atende ao CA4. Não encontrei apontamentos. Rodei os testes pelo PowerShell com o drive em maiúsculo: 11 arquivos e 51 testes passaram, sem falhas.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA4: link não usado dentro do prazo e depois usado vencido → o acesso é bloqueado | atendido | `apps/web/src/app/core/services/auth.service.ts:79-82` (devolve `'expirado'` antes do PATCH, então não grava `usedAt` nem sessão) |
| CA4: teste com relógio simulado prova que `expiresAt` no passado dá `'expirado'` sem gravar sessão | atendido | `apps/web/src/app/core/services/auth.service.spec.ts:175-191` (relógio fixo pelo `vi.setSystemTime` em `:100-101`; `expectNone` garante que não houve PATCH; `sessao()` e `localStorage` continuam nulos) |
| CA4: "o usuário poderá solicitar um novo link" | atendido | `apps/web/src/app/features/auth/auth-callback/auth-callback.html:6-14` (link "Solicitar novo link" com `routerLink="/entrar"`) |
| CA4: teste da tela mostra a mensagem de bloqueio e o link para `/entrar` | atendido | `apps/web/src/app/features/auth/auth-callback/auth-callback.spec.ts:57-79` (confere o texto do alerta, que a URL não muda, `href="/entrar"`, e que o clique leva a `/entrar`) |
| Texto da mensagem (Decisões técnicas do plano: "CA4: a mensagem do CA3 + link") | atendido | `auth-callback.html:3-5` ("e-mail não permitido ou link inválido") |
| Abandono no meio: "fecha a aba … depois de 1 hora, usá-lo é bloqueado e ele pode solicitar outro (CA4)" | atendido | Mesmo caminho do CA4 acima. A validade é conferida na hora do clique, contra o `expiresAt` gravado. |
| CA2 e CA3 continuam funcionando depois da mudança | atendido | Os testes das Tarefas 7 e 9 passaram. O teste em `auth.service.spec.ts:212-233` mostra que um link já usado e também vencido continua dando `'invalido'`, ou seja, a mensagem do CA3, como pede "Abandono no meio" para link já usado. |

## Apontamentos

(nenhum)

Observações que não reprovam:
- **Limite da validade:** o teste em `auth.service.spec.ts:193-210` define que, no instante exato de `expiresAt`, o link ainda vale. Isso segue o plano ("Expirado = `expiresAt` no passado") e o "dentro do prazo de validade" do CA2. Não é escopo novo.
- **Link só para expirado:** "Solicitar novo link" aparece só quando o motivo é `'expirado'`. Nenhum teste confere que ele fica oculto quando o motivo é `'invalido'`. A spec não pede nem proíbe o link nesse caso, então não é falha de conformidade.
- **Glossário:** nenhum termo novo do diff vai contra o glossário de `docs/architecture.md`.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.spec.ts
