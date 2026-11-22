# Parecer de Conformidade — Tarefa 7

**Veredito:** APROVADO

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA2: clicar no link dentro do prazo libera o acesso. Na Tarefa 7 isso significa: o link é confirmado, marcado como usado e a sessão é gravada | atendido | `apps/web/src/app/core/services/auth.service.ts:71-96`; teste em `apps/web/src/app/core/services/auth.service.spec.ts:115-137` |
| CA2, decisão da equipe: "liberar o acesso é levar o aluno à tela **Início**" | atendido | `apps/web/src/app/features/auth/auth-callback/auth-callback.ts:15-21`, `apps/web/src/app/app.routes.ts:8-16`; teste em `apps/web/src/app/features/auth/auth-callback/auth-callback.spec.ts:28-39` |
| CA2, decisão da equipe: a tela Início "mostra o e-mail com que ele entrou (ex.: 'Você entrou como fulano@alunos.utfpr.edu.br')" | atendido | `apps/web/src/app/features/inicio/inicio.html:3-5`; teste em `apps/web/src/app/features/inicio/inicio.spec.ts:19-26` |
| Assume que: a sessão fica no `localStorage` (premissa que fecha na #25) | atendido | `apps/web/src/app/core/services/auth.service.ts:42-44, 87-96` (chave `munte.sessao`, com `// TODO #25`) |
| CA2, decisão da equipe: "Sem sessão válida, a tela Início não é exibida" (guard) | fora desta tarefa (Tarefa 8) | — |
| CA3, parte do link: link inválido ou já usado | fora desta tarefa (Tarefa 9) | — |
| CA4: link expirado | fora desta tarefa (Tarefa 10) | — |

Testes: `npm test` rodado pelo PowerShell com `C:\` em maiúsculo. Passaram 10 arquivos de teste e 38 testes, entre eles os três novos que cobrem a tarefa.

Como os testes provam o CA2:
- **`auth.service.spec.ts`:**
  - Confere o `GET /magicLinks` com o parâmetro `token`.
  - Confere o `PATCH /magicLinks/1` com corpo `{ usedAt: <agora> }`, usando relógio simulado.
  - Mostra que a sessão continua `null` até a resposta do PATCH chegar.
  - Depois da resposta, confere o retorno `'valido'`, o signal `sessao` e o conteúdo do `localStorage`.
  - As asserções são fortes. Nenhuma delas testa o próprio mock.
- **`auth-callback.spec.ts`:**
  - Usa as `routes` reais com `withComponentInputBinding()`.
  - Prova que o token da URL chega a `confirmarLink`.
  - Prova que a URL final é `/inicio` e que a tela Início aparece com o e-mail.
- **`inicio.spec.ts`:** prova o texto exato pedido pela decisão da equipe.

Glossário do `docs/architecture.md`: não há divergência. `MagicLink` e `Sessao` não estão no glossário. O plano já prevê documentá-los no fechamento da Issue (seção 8 e ER).

Escopo: o diff fica dentro dos arquivos previstos para a tarefa. Dois pontos que avaliei e não considero escopo inflado:
- Ler a sessão do `localStorage` quando o service nasce (teste `auth.service.spec.ts:139`) está nas decisões técnicas do plano ("lida e gravada no `localStorage`").
- O texto de espera do callback ("Confirmando seu acesso") é o conteúdo mínimo que a tela precisa ter.

## Apontamentos

---

Observações para o orquestrador. Ficam fora do parecer porque não violam nenhum critério da spec:

1. **Rota `''` → `inicio` ausente.** As decisões técnicas do plano incluem "`''` → redireciona para `inicio`", mas `apps/web/src/app/app.routes.ts` não tem essa rota. Nenhuma tarefa do plano a cita no texto. Como as Tarefas 7 e 8 mexem em `app.routes.ts`, convém o usuário decidir em qual das duas ela entra, para não ficar esquecida.
2. **Estado provisório e esperado, conforme o fatiamento do plano.** Hoje `confirmarLink` aceita qualquer token existente como `'valido'`:
   - Não confere `expiresAt` nem `usedAt`.
   - Com token inexistente, `magicLink` fica `undefined` e o código quebra ao ler `magicLink.id` (`auth.service.ts:73-75`).
   - A rota `inicio` ainda não tem guard.

   Isso cabe às Tarefas 8, 9 e 10. Fica o registro para que essas tarefas não sejam puladas.
3. **`autenticado = computed(...)` ainda não existe.** O plano o prevê no `AuthService`, mas quem o usa é o guard da Tarefa 8. Fora desta tarefa.

Arquivo para gravar o parecer, como manda a regra 7: `c:\Users\Gabriel\Desktop\munte_app\specs\8-us12-autenticacao-email-institucional\reviews\tarefa-07-conformidade-r<rodada>.md`. Eu não o gravei, porque sou somente leitura.
