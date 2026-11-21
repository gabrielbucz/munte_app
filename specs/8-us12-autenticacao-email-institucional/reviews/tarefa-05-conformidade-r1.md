# Parecer de Conformidade — Tarefa 5

**Veredito:** APROVADO

O diff cumpre a parte de e-mail do CA3, respeita o "Fora de escopo" e o "Assume que", e não adianta trabalho da Tarefa 6. Os testes passam: `npm test` deu 7 arquivos e 28 testes, nenhuma falha.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA3 (e-mail): e-mail não institucional, ao tentar entrar, "exibe 'e-mail não permitido ou link inválido'" (texto exato) | atendido | `apps/web/src/app/features/auth/login/login.html:24-28`; teste em `login.spec.ts:112-130` compara com `toBe('e-mail não permitido ou link inválido')`, sem `toContain` |
| CA3 (e-mail): "bloqueia o acesso" (nenhum quadro "E-mail simulado" nem link de callback na tela) | atendido | `login.ts:25-26` limpa os dois signals no começo do envio; `login.ts:29-33` só liga `emailNaoPermitido`. Testes em `login.spec.ts:124`, `:143-154` e `:156-167`. Este último confirma que o link antigo some (`a[href=...]` nulo) |
| Fora de escopo: `@utfpr.edu.br` tratado como não permitido | atendido | `login.spec.ts:112` (`it.each` com `fulano@gmail.com` e `fulano@utfpr.edu.br`). A rejeição real pelo domínio está no service (`auth.service.ts:50`, igualdade exata com `@alunos.utfpr.edu.br`) e é provada em `auth.service.spec.ts:53`, da Tarefa 2 |
| Assume que: envio simulado, quadro "E-mail simulado" | atendido | O quadro continua igual, com o `TODO #25` (`login.html:44-61`), e aparece só no caminho de sucesso |
| CA6 (falha de rede), que é da Tarefa 6 | fora desta tarefa, e não foi adiantado | `login.ts:34-35`: não há mensagem nem botão "Tentar novamente". O erro só vai para o `ErrorHandler`, como na Decisão 1. O teste em `login.spec.ts:169-179` só confirma que a mensagem do CA3 não aparece nesse caso |
| CA3 (link inválido/expirado): Tarefas 9 e 10 | fora desta tarefa | Nada do callback foi tocado |

## Apontamentos

Nenhum.

## Observações (não são apontamentos)
- **Como a prova se divide:** em `login.spec.ts`, o mock do `AuthService` é que lança `EmailNaoPermitidoError`. A tela é testada pela reação a essa rejeição, como pede o texto da tarefa ("a tela ainda não trata a rejeição do service"). Que o service rejeita `@gmail.com` e `@utfpr.edu.br` já está provado com o service real em `auth.service.spec.ts:53`. Não é o caso de um mock testando o próprio mock.
- **Atributos de acessibilidade:** `aria-invalid` e `aria-describedby` no campo (`login.html:17-18`) e `role="alert"` na mensagem não estão na spec. Não os contei como escopo inflado: não criam comportamento novo, só deixam acessível a mensagem que o CA3 já pede. Se quiser, quem avalia isso é o revisor de código.
- **Decisões registradas antes da implementação:** as três aparecem no diff como foram descritas. São elas: (1) erro que não é de domínio vai para o `ErrorHandler`, sem mensagem; (2) testes de "errar e depois acertar" e "acertar e depois errar"; (3) dois signals, limpos no começo de cada envio.

Arquivos revisados:
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\login\login.ts`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\login\login.html`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\login\login.spec.ts`
- Para contexto: `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts` e `auth.service.spec.ts`

Pelo método do agente, o veredito sai como "APROVADO | APONTAMENTOS". O fluxo é que grava este parecer em `specs/8-us12-autenticacao-email-institucional/reviews/tarefa-05-conformidade-r<rodada>.md`, porque eu sou somente leitura.
