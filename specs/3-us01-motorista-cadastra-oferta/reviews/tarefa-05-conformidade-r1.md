# Parecer de Conformidade — Tarefa 5

**Veredito:** APROVADO

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA5: um horário no passado é recusado com "precisa ser no futuro" | atendido | `apps/web/src/app/features/driver/ride-offer-form/horario-futuro.validator.ts:5-9`, `ride-offer-form.ts:26-29,53`, `ride-offer-form.html:101-107` |
| CA5 (decisão da equipe): "futuro" é qualquer instante depois de agora, sem antecedência mínima | atendido | `horario-futuro.validator.ts:8` usa `>` estrito contra `Date.now()`, sem margem. `horario-futuro.validator.spec.ts:21-31` usa um relógio simulado: 1 minuto depois passa, exatamente agora é recusado, 1 minuto antes é recusado |
| CA5 + CA9: a mensagem aparece ao sair do campo, e "Publicar" fica desligado | atendido | `ride-offer-form.spec.ts:358-372`. Todos os outros campos são válidos, a mensagem é exatamente "precisa ser no futuro", há só um alerta na tela e o botão está desligado |
| CA4 continua valendo com o novo validador (horário vazio mostra só "preenchimento obrigatório") | atendido | `horario-futuro.validator.ts:7` devolve null para valor vazio. Coberto em `horario-futuro.validator.spec.ts:33-35` e no teste já existente do CA4 para "Horário" (`ride-offer-form.spec.ts:217-229`), que continua passando |
| CA8: observações com mais de 200 caracteres bloqueiam com "máximo 200 caracteres" | atendido | `ride-offer-form.ts:35,54`, `ride-offer-form.html:136-147` |
| CA8 + CA9: o limite aceita 200 e recusa 201, com mensagem e botão desligado | atendido | `ride-offer-form.spec.ts:374-404`. Com 200 caracteres: sem `aria-invalid`, sem mensagem, nenhum alerta, botão ligado. Com 201: `aria-invalid="true"`, a mensagem exata, um alerta, botão desligado |
| Observações continuam opcionais (CA2/CA4) | atendido | `ride-offer-form.ts:35` tem só `maxLength(200)`, sem `required` |

Testes: rodei `npm test` pelo PowerShell com `C:` maiúsculo. Passaram 14 suítes e 83 testes, entre eles as 4 provas novas do validador e as 3 provas novas do formulário.

Escopo:
- O diff mexe só nos arquivos previstos para a Tarefa 5.
- Não há comportamento que a spec não pediu. O `aria-invalid` e o `aria-describedby` das observações seguem o padrão que os outros campos já usavam nas Tarefas 2 a 4.
- Não foi adicionado `maxlength` nativo no textarea. O CA8 continua demonstrável, porque o motorista consegue digitar o 201º caractere e ver o bloqueio.
- O horário que passa a ser passado com a tela aberta ficou de fora, como o usuário decidiu antes da implementação. A spec não lista esse caso em "Abandono no meio".

Glossário: os nomes `departureTime` e `notes` batem com o `RideOffer` do `docs/architecture.md` (seção 5, linha 95). O nome `horarioFuturo` é o que o `plan.md` definiu.

## Apontamentos

