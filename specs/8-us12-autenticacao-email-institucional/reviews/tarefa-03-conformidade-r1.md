# Parecer de Conformidade — Tarefa 3

**Veredito:** APROVADO

A Tarefa 3 cumpre o CA1 e não encontrei nenhum apontamento. A suíte passa: `npm test`, rodado no PowerShell a partir de `C:\Users\Gabriel\Desktop\munte_app`, terminou com 7 arquivos e 20 testes aprovados, incluindo os 5 novos de `login.spec.ts`.

Comecei pela spec, depois li o diff inteiro (`git diff bfaf0d3ffdcf0e45897159b74c434a5ccd5a39e7`). São 4 arquivos, todos no índice e todos dentro dos "Arquivos previstos" da tarefa.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA1: um e-mail @alunos.utfpr.edu.br, ao solicitar acesso, recebe o link de confirmação. O envio é simulado, como diz o "Assume que": o link aparece na tela | atendido | `apps/web/src/app/app.routes.ts:4-7` (rota `/entrar` com `loadComponent`); `apps/web/src/app/features/auth/login/login.ts:22-26` (chama `AuthService.solicitarLink` e guarda o link num signal); `apps/web/src/app/features/auth/login/login.html:36-53` (quadro "E-mail simulado" com `<a [href]="link">`) |
| Teste: a rota `/entrar` mostra a tela | atendido | `login.spec.ts:47-52`. Navega pelo `RouterTestingHarness` usando as `routes` reais, então prova a rota de verdade |
| Teste: submeter `fulano@alunos.utfpr.edu.br` chama `solicitarLink` e mostra o quadro com o link clicável | atendido | `login.spec.ts:54-69`. Confere que a chamada é única e com o e-mail certo, que o quadro tem o título "E-mail simulado" e que o `href` do `<a>` é o link devolvido. O mock fica no limite do service, e o que se testa é o comportamento da tela. Não é um teste do próprio mock |
| Teste: o botão fica desabilitado com o campo vazio ou fora do formato | atendido | `login.spec.ts:71-83` (`''`, `'fulano'`, `'fulano@'`); `login.html:24` (`[disabled]="form.invalid"`); `login.ts:14-17` (`Validators.required` e `Validators.email`) |
| "Assume que" (#25): o envio é simulado no quadro "E-mail simulado", com o TODO #25 | atendido | `login.html:37-38` (`<!-- TODO #25: envio simulado ... -->`). É o comentário que o plan.md pede para o quadro |
| "Fora de escopo": nada de envio real, Supabase, senha, OAuth ou links de outras histórias | atendido | O diff não traz nada disso |
| Não adiantar outras tarefas | atendido | Não há tratamento de rejeição de domínio (Tarefa 5), de erro de rede (Tarefa 6), nem rotas `auth/callback`, `inicio` ou `''` (Tarefas 7 e 8). O header também não foi mexido (Tarefa 4) |
| Glossário (`docs/architecture.md`) | atendido | Os nomes `Login`, `solicitarLink` e `features/auth/login/` seguem a seção 4 e as decisões técnicas do plano. Não há termo de domínio divergente |
| Casos de abandono da spec | fora desta tarefa | A rede caindo é da Tarefa 6. Fechar a aba e o link expirado são da Tarefa 10 |

## Apontamentos

Nenhum.

Fica uma observação que não bloqueia: em `login.ts:23-25`, o `subscribe` só tem o callback de sucesso. Hoje, um e-mail de outro domínio (`EmailNaoPermitidoError`) ou uma falha de rede vira um erro sem tratamento e nada muda na tela. Está dentro do escopo, porque é exatamente isso que as Tarefas 5 (CA3) e 6 (CA6) vão cobrir. Registro aqui só para conferir nessas tarefas.

Outra coisa esperada: o link do quadro aponta para `/auth/callback?token=...`, uma rota que só nasce na Tarefa 7. Seguir esse link agora não chega a nenhuma tela, e isso não fere o CA1.

Não alterei nenhum arquivo. Usei o Bash só para `git diff`, `git status` e `npm test`.
