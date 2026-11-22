# Parecer de Conformidade — Tarefa 9

**Veredito:** APROVADO

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA3, parte do link: link inválido (token inexistente, adulterado ou incompleto) bloqueia o acesso, sem gravar sessão | atendido | `apps/web/src/app/core/services/auth.service.ts:76-78`; teste em `apps/web/src/app/core/services/auth.service.spec.ts:139-155` |
| CA3 e "Abandono no meio": link já usado (`usedAt` preenchido) bloqueia o acesso, sem PATCH e sem sessão | atendido | `apps/web/src/app/core/services/auth.service.ts:76`; teste em `apps/web/src/app/core/services/auth.service.spec.ts:157-173` |
| CA3: a tela exibe "e-mail não permitido ou link inválido" e não navega | atendido | `apps/web/src/app/features/auth/auth-callback/auth-callback.html:2-6`, `apps/web/src/app/features/auth/auth-callback/auth-callback.ts:23-25`; teste em `apps/web/src/app/features/auth/auth-callback/auth-callback.spec.ts:42-54` |
| "Abandono no meio", link incompleto (sem `token` na URL) | atendido | `auth-callback.ts` manda `''`. No json-server 0.17.4 (`node_modules/json-server/lib/server/router/plural.js:126`) `?token=` não bate com nenhum registro e devolve `[]`, que cai no ramo `invalido` |
| CA4: link expirado bloqueado e "Solicitar novo link" | fora desta tarefa (Tarefa 10) | — |

## Apontamentos

(nenhum)

---

O que conferi, para registro:
- **Diff:** o diff de `21dd449` em `apps` muda só os 5 arquivos que o plano prevê para a Tarefa 9. O código não faz nada que a spec não peça. O ramo `'expirado'` continua sem tratamento, e isso é escopo da Tarefa 10. Até ela entrar, um link expirado e ainda não usado é aceito como válido.
- **Testes:** `npm test` pelo PowerShell (drive `C:`): 11 arquivos e 47 testes, todos passando.
- **Os testes de fato provam o critério:**
  - No service, `http.expectNone(() => true)` mostra que não houve PATCH. `sessao()` e `localStorage` nulos mostram que a sessão não foi gravada. O `afterEach` com `http.verify()` cobre o resto.
  - No callback, o teste confere a URL, que continua `/auth/callback?token=...` (não navegou), e o texto exato do `[role="alert"]`.
  - Os dois testes falhariam sem a mudança. Sem o guard, `magicLink.id` com array vazio dá TypeError e `usedAt` preenchido gera o PATCH. Sem a mudança no template, o `role="alert"` não existe.
- **Glossário** (`docs/architecture.md`, seção 5): nenhum termo novo e nenhuma divergência.
- **Observação que não reprova:** o título "Acesso bloqueado" (`auth-callback.html:2`) não está na lista de textos de interface do plano. É só o título do estado de bloqueio, não muda comportamento. Registro para a triagem, sem apontamento.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.spec.ts
