# Parecer de Conformidade — Tarefa 8

**Veredito:** APROVADO

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA2 (decisão da equipe): "liberar o acesso é levar o aluno à tela Início, uma tela mínima protegida pelo guard". Com sessão, o guard libera | atendido | `apps/web/src/app/core/guards/auth.guard.ts:5-6`; `apps/web/src/app/app.routes.ts:18` (`canActivate: [authGuard]`); teste `auth.guard.spec.ts:47-51` |
| CA2 (decisão da equipe): "Sem sessão válida, a tela Início não é exibida" | atendido | teste `auth.guard.spec.ts:73-81` (navega para `/`, termina em `/entrar` e não contém "Você entrou como") |
| CA3: "bloqueia o acesso" (o trecho do guard; a mensagem e o link são das Tarefas 5 e 9) | atendido | `auth.guard.ts:6` devolve `UrlTree` para `/entrar`; teste `auth.guard.spec.ts:53-60` (verifica `UrlTree` e serializa a URL como `/entrar`) |
| Plano: redirecionamento `''` para `inicio` (Decisões técnicas) | atendido | `app.routes.ts:5`; testes `auth.guard.spec.ts:62-71` (com sessão, `/` leva a `/inicio` e exibe o e-mail) e `:73-81` (sem sessão, leva a `/entrar`) |
| Plano: `autenticado = computed(() => sessao() !== null)` | atendido | `apps/web/src/app/core/services/auth.service.ts:45`; testes `auth.service.spec.ts:169-181` (falso sem sessão, verdadeiro com sessão no `localStorage`) |
| Plano: o AuthService falso do callback ganha `autenticado` | atendido | `apps/web/src/app/features/auth/auth-callback/auth-callback.spec.ts:22`. Sem isso o teste do CA2 da Tarefa 7 quebraria, porque `/inicio` agora tem guard |
| CA1, CA4, CA6, CA7, CA8, CA9; CA3 na parte do link | fora desta tarefa | Tarefas 1 a 7, 9 e 10 do plano |

## Apontamentos

---
O que fiz e o que vi:
- Os testes rodaram pelo PowerShell (`Set-Location 'C:\Users\Gabriel\Desktop\munte_app'; npm test`): 11 arquivos e 44 testes, todos passaram, incluindo a suíte nova `spec-app-core-guards-auth.guard`.
- O guard é testado com o `AuthService` real (com `provideHttpClientTesting`, e a sessão vem do `localStorage`), não com um mock. O teste de rotas usa o `routes` real de `app.routes.ts`. Então não é um mock testando o mock.
- O escopo não cresceu: o diff toca só os 6 arquivos previstos na Tarefa 8, e nada faz o trabalho das Tarefas 9 e 10.
- Glossário: o método se chama `autenticado()` e não `isAuthenticated()`, que é o nome do exemplo da ID19 em `docs/architecture.md:190`. Não contei isso como apontamento, por dois motivos: o `plan.md` aprovado escolhe `autenticado` de forma explícita, e o glossário (seção 5) mapeia nomes de entidades, não de métodos. Se a equipe quiser alinhar com a ID19, quem decide é o revisor de código ou o usuário.
- Não alterei nenhum arquivo. O Bash serviu só para o `git diff`/`git status` e para rodar os testes.

Arquivos relevantes:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\guards\auth.guard.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\guards\auth.guard.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.routes.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\auth-callback\auth-callback.spec.ts
