# Parecer de Conformidade — Tarefa 8 (rodada 2)

**Veredito:** APROVADO

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA2, decisão da equipe: "liberar o acesso é levar o aluno à tela Início, uma tela mínima protegida pelo guard". Com sessão, o guard libera a rota | atendido | `apps/web/src/app/core/guards/auth.guard.ts:5-6`; `apps/web/src/app/app.routes.ts:18` (`canActivate: [authGuard]`); teste `auth.guard.spec.ts:41-45` |
| CA2, decisão da equipe: "Sem sessão válida, a tela Início não é exibida" | atendido | teste `auth.guard.spec.ts:67-75`: com as rotas reais, a navegação para `/` termina em `/entrar` e o texto "Você entrou como" não aparece |
| CA3: "bloqueia o acesso" (a parte do guard; a mensagem é das Tarefas 5 e 9) | atendido | `auth.guard.ts:6` devolve `createUrlTree(['/entrar'])`; teste `auth.guard.spec.ts:47-54` confere que o retorno é um `UrlTree` e que ele serializa para `/entrar` |
| Plano: redirecionamento de `''` para `inicio` | atendido | `app.routes.ts:5` (com `pathMatch: 'full'`); testes `auth.guard.spec.ts:56-65` (com sessão: `/inicio` mostrando o e-mail) e `:67-75` (sem sessão: `/entrar`) |
| Plano: `autenticado = computed(() => sessao() !== null)` | atendido | `apps/web/src/app/core/services/auth.service.ts:45`; testes `auth.service.spec.ts` no bloco `AuthService.autenticado`: falso sem sessão, verdadeiro com sessão |
| Plano: o AuthService falso do callback ganha `autenticado` | atendido | `apps/web/src/app/features/auth/auth-callback/auth-callback.spec.ts:22` |
| Apontamento aceito na rodada 1 (`tarefa-08-decisoes-r1.md`, item 1): o teste do guard não pode depender do `localStorage` nem da chave `munte.sessao` | atendido | `auth.guard.spec.ts:18-31`: o AuthService virou um falso com os signals `sessao` e `autenticado`. A gravação no `localStorage` saiu do spec do guard e só existe no `auth.service.spec.ts`, que testa o mecanismo do próprio service |
| CA1, CA4, CA6, CA7, CA8, CA9; CA3 na parte do link | fora desta tarefa | Tarefas 1 a 7, 9 e 10 do plano |

## Apontamentos

---
O que fiz e o que vi:
- Rodei os testes pelo PowerShell, com o drive em maiúsculo (`Set-Location 'C:\Users\Gabriel\Desktop\munte_app'; npm test`). Passaram todos: 11 arquivos e 44 testes, incluindo a suíte `spec-app-core-guards-auth.guard`.
- O diff (`git diff 2f7d9e9 -- apps`) mexe só nos 6 arquivos que o plano prevê para a Tarefa 8. Nenhum deles adianta o trabalho das Tarefas 9 e 10, então o escopo não cresceu. Todas as mudanças estão no índice; não há nada fora dele no working tree.
- Mesmo com o AuthService falso, o teste não fica "testando o mock". O guard que roda é o real, e as rotas também (`routes` de `app.routes.ts`). O falso entrega só o contrato `autenticado()` e `sessao()`. O `computed` real do `autenticado` tem prova própria no `auth.service.spec.ts`. Juntas, as duas suítes cobrem a cadeia de ponta a ponta.
- Não virou apontamento: no falso, `sessao` e `autenticado` são signals independentes. O revisor de código já registrou isso na r1 como sugestão que não bloqueia. Hoje os dois andam sempre juntos, pelo mesmo `comSessao`, então nenhum teste fica incoerente.
- Não alterei nenhum arquivo. Usei o Bash só para o `git diff`/`git status` e para rodar os testes.

Arquivos relevantes:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\guards\auth.guard.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\guards\auth.guard.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.routes.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\specs\8-us12-autenticacao-email-institucional\reviews\tarefa-08-decisoes-r1.md
