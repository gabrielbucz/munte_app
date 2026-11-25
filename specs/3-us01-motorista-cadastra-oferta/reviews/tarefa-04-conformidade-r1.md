# Parecer de Conformidade — Tarefa 4

**Veredito:** APROVADO

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA3: com 0 ou vaga negativa, publicar fica bloqueado com "mínimo 1 vaga" | atendido | `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.ts:28` (`Validators.min(1)`), `:47` (mensagem); teste em `ride-offer-form.spec.ts:334-345` (casos 0 e -1) |
| CA7: acima de 4 vagas, publicar fica bloqueado com "máximo 4 vagas" | atendido | `ride-offer-form.ts:29` (`Validators.max(4)`), `:48` (mensagem); teste em `ride-offer-form.spec.ts:334-345` (caso 5) |
| CA9, só no que toca às vagas: a mensagem aparece ao sair do campo com valor inválido e "Publicar" fica desligado enquanto o valor for inválido | atendido | `ride-offer-form.spec.ts:315-324` (preenche tudo como válido menos Vagas, digita e sai do campo); `:342-344` (a mensagem fica ligada ao campo por `aria-describedby`, há exatamente 1 alerta e o botão fica desligado) |
| Lado "aceita" pedido no plano: 1 e 4 passam | atendido | `ride-offer-form.spec.ts:326-332` (sem mensagem, 0 alertas, botão ligado) |
| CA4: vagas vazias continuam com "preenchimento obrigatório" | atendido, sem regressão | `ride-offer-form.ts:27`; os testes da Tarefa 2 ("Vagas" vazio) continuam passando |

Testes: rodei pelo PowerShell com o drive em maiúsculo. Resultado: 13 arquivos e 76 testes, todos passando. Com o reporter verbose confirmei que os 5 testes novos rodaram e passaram: aceita 1, aceita 4, recusa 0, recusa -1 e recusa 5.

Por que os testes provam os critérios:
- Comparam o texto exato da mensagem (`toBe(mensagem)`). Assim uma mensagem juntada a outra, como "preenchimento obrigatório" mais "mínimo 1 vaga", faria o teste falhar.
- Contam os alertas da tela (exatamente 1 nos recusados e 0 nos aceitos).
- Conferem o `disabled` do botão de verdade.
- Os demais campos ficam válidos, então só Vagas pode desligar o botão.
- Antes da tarefa, 0, -1 e 5 eram valores válidos, então os testes de recusa falhavam. O "teste primeiro" do plano é coerente com isso.

Escopo:
- Nada além do plano. O diff só acrescenta os validadores `min` e `max` em `seats` e as duas mensagens.
- O `.html` não foi alterado: o template já mostrava a mensagem de cada erro pela tabela `mensagensDeErro`, então não precisou mudar.
- Valores fracionários não são tratados, conforme a decisão do usuário registrada antes da implementação. A spec não pede vaga inteira, então isso não é falha de conformidade.

Glossário: o diff não cria termo novo. O controle `seats` (o glossário chama de `totalSeats` em `RideOffer`) já existia desde a Tarefa 1 e o plano o prevê com esse nome. A conversão para `totalSeats` está prevista na Tarefa 7, então isso não pertence a esta tarefa.

Casos de abandono: nenhum se aplica a esta tarefa. Descarte, rede e clique duplo ficam nas Tarefas 8, 9 e 10.

## Apontamentos

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html (sem alteração)
- c:\Users\Gabriel\Desktop\munte_app\specs\3-us01-motorista-cadastra-oferta\spec.md
- c:\Users\Gabriel\Desktop\munte_app\specs\3-us01-motorista-cadastra-oferta\plan.md
