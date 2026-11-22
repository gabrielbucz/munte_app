# Parecer de Conformidade — Tarefa 6

**Veredito:** APROVADO

O diff cumpre o CA6 sem nenhum apontamento. Ele trata a falha de rede, mantém o e-mail digitado, permite tentar de novo com sucesso e não quebra o CA1 nem o CA3 da tela Entrar. Também não adianta trabalho das Tarefas 7 a 10.

Rodei `npm test` na raiz (`C:/Users/Gabriel/Desktop/munte_app`): 7 arquivos e 32 testes, todos passando.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA6 — informar o erro quando a rede falha | atendido | `apps/web/src/app/features/auth/login/login.html:30-34` mostra o texto do plano, igual ao da seção "Textos de interface", com `role="alert"`. `apps/web/src/app/core/services/auth.service.ts` (novo `catchError` e `falhaDeRede()`) transforma o status 0 em `FalhaDeRedeError`. Testes: `login.spec.ts:193-213` e o teste "CA6: falha de rede no POST /magicLinks vira FalhaDeRedeError" em `auth.service.spec.ts`. |
| CA6 — permitir nova tentativa | atendido | `login.html:45` troca o rótulo do mesmo botão para "Tentar novamente", que continua preso a `form.invalid` (D3). Teste em `login.spec.ts:215-231`: um segundo clique, sem digitar de novo, chama `solicitarLink` outra vez com o mesmo e-mail, exibe o quadro "E-mail simulado", apaga a mensagem de falha e volta o rótulo para "Solicitar acesso". |
| "Abandono no meio" — tentar de novo sem precisar redigitar o e-mail | atendido | `login.ts:29-48` não chama `form.reset()`. `login.spec.ts:209-210` confere que o campo continua com `fulano@alunos.utfpr.edu.br`, e o teste da linha 215 tenta de novo sem chamar `digitarEmail`. |
| D1 (4xx/5xx propagam como estão) e D1b (vão só ao ErrorHandler) | atendido | Teste do erro 500 em `auth.service.spec.ts` (é `HttpErrorResponse` e não é `FalhaDeRedeError`). `login.spec.ts:233-248`: nenhum alerta, rótulo continua "Solicitar acesso", `handleError` é chamado com o erro. |
| D2 (falha de rede não vai ao ErrorHandler) | atendido | `login.ts:41-44` e `login.spec.ts:202` |
| S1, S2, S3 e S4 | atendido | S1: `login.spec.ts:243`. S2: `login.ts:30-32`. S3: `login.html:31` e `login.spec.ts:211-212`. S4: o comentário "Tarefa 6" saiu de `login.ts`. |
| CA1 (tela Entrar) — sem regressão | atendido | `login.spec.ts:96-133` continua passando, e o rótulo padrão continua "Solicitar acesso". |
| CA3 (e-mail na tela Entrar) — sem regressão | atendido | `login.spec.ts:135-191` continua passando. Os signals separados e limpos no início do envio evitam que as duas mensagens apareçam juntas. |
| "Fora de escopo" e "Assume que" | atendido | Não há envio real, Supabase, estado "enviando" (fica para uma Issue futura, decisão E) nem mudança no quadro simulado ou no `localStorage`. |
| Não adiantar outras tarefas | atendido | O diff só mexe em `login.{ts,html,spec.ts}` e `auth.service.{ts,spec.ts}`, todos previstos na Tarefa 6. Não há `confirmarLink`, callback, Início nem guard. |
| Glossário do `docs/architecture.md` | atendido | Os termos novos (`FalhaDeRedeError`, `falhaDeRede`) não batem com nenhuma entrada do glossário (seção 5). |

## Apontamentos

(nenhum)
