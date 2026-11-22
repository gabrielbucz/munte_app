# Parecer de Conformidade — Tarefa 9 (rodada 2)

**Veredito:** APROVADO

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA3, parte do link: um link inválido (token inexistente, adulterado ou incompleto) bloqueia o acesso sem gravar sessão | atendido | `apps/web/src/app/core/services/auth.service.ts:76-78`; teste em `apps/web/src/app/core/services/auth.service.spec.ts:139-155` |
| CA3 e "Abandono no meio" ("clica num link já usado"): com `usedAt` preenchido, não há PATCH e a sessão não é gravada | atendido | `apps/web/src/app/core/services/auth.service.ts:76`; teste em `apps/web/src/app/core/services/auth.service.spec.ts:157-173` |
| CA3: a tela exibe "e-mail não permitido ou link inválido" e bloqueia o acesso (não navega) | atendido | `apps/web/src/app/features/auth/auth-callback/auth-callback.html:2-6`, `apps/web/src/app/features/auth/auth-callback/auth-callback.ts:23-25`; teste em `apps/web/src/app/features/auth/auth-callback/auth-callback.spec.ts:42-55` |
| Decisão 1 da rodada 1 (aceita): remover o título "Acesso bloqueado" | atendido | `auth-callback.html` só tem o `<p role="alert">` com o texto da spec. "Acesso bloqueado" aparece agora só na asserção negativa em `auth-callback.spec.ts:54` |
| CA4: link expirado bloqueado e "Solicitar novo link" | fora desta tarefa (Tarefa 10) | — |

## Apontamentos

(nenhum)

---

O que conferi, para registro:
- **Diff** (`git diff 21dd449 -- apps`): mexe só nos 5 arquivos que o plano prevê para a Tarefa 9. O código não faz nada que a spec não peça. Em relação à rodada 1, a única mudança é a saída do título "Acesso bloqueado", que corresponde à decisão aceita em `tarefa-09-decisoes-r1.md`. No estado inválido, a tela mostra só o texto exato do CA3 e esconde "Confirmando seu acesso". O ramo `'expirado'` continua sem tratamento, e isso é escopo da Tarefa 10.
- **Testes:** rodei `npm test` pelo PowerShell com o drive `C:`. Passaram os 11 arquivos e os 47 testes.
- **Os testes provam o critério:**
  - No service, `http.expectNone(() => true)` mostra que não houve PATCH. `sessao()` e `localStorage` nulos mostram que a sessão não foi gravada.
  - No callback, o teste confirma que a URL continua `/auth/callback?token=token-adulterado` (não navegou) e confere o texto exato do `[role="alert"]`.
  - A asserção `not.toContain('Acesso bloqueado')` protege a decisão aceita contra regressão. Não reprova.
- **Glossário:** a tarefa não introduz nenhum termo novo.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.spec.ts
