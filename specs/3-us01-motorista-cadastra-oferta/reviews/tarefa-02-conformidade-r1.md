# Parecer de Conformidade — Tarefa 2

**Veredito:** APROVADO

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA4: com horário ou ponto vazio, mostra "preenchimento obrigatório" e bloqueia. A decisão da equipe estende isso a sentido, bairro, ponto, horário e vagas; observações é opcional. | atendido | `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.ts:23-33` (`Validators.required` nos 5 campos obrigatórios, nenhum em `notes`); `ride-offer-form.ts:35-37` (texto da mensagem); `ride-offer-form.html:26-32, 52-58, 78-84, 100-106, 120-126` (mensagem por campo); `ride-offer-form.html:142` (`[disabled]="form.invalid"`). Testes em `ride-offer-form.spec.ts:204, 218, 238, 249` |
| CA9: na tela recém-aberta, nenhuma mensagem aparece | atendido | `ride-offer-form.html` (cada mensagem só aparece com `invalid && touched`); teste em `ride-offer-form.spec.ts:196` (nenhum `[role="alert"]`, nenhum texto "preenchimento obrigatório") |
| CA9: a mensagem aparece quando o motorista sai do campo com valor inválido | atendido | `ride-offer-form.spec.ts:204` (blur em Bairro, Ponto, Horário e Vagas; a mensagem fica ligada ao campo por `aria-describedby`, e só há 1 alerta na tela); `ride-offer-form.spec.ts:218` (blur nos rádios de Sentido; mensagem única no fieldset) |
| CA9: "Publicar" fica desligado enquanto houver qualquer campo inválido | atendido | `ride-offer-form.html:140-150`; testes em `ride-offer-form.spec.ts:196` (desligado ao abrir), `:238` (cada obrigatório vazio com o resto preenchido continua desligado), `:230` (tudo válido liga) |
| Observações vazias não bloqueiam (decisão da equipe no CA4) | atendido | `ride-offer-form.ts:32`; teste em `ride-offer-form.spec.ts:249` |

Outros pontos conferidos:
- **Testes:** rodei pelo PowerShell com `C:` maiúsculo. Passaram 13 arquivos e 68 testes. No modo verbose, os 13 casos do bloco "RideOfferForm: campos obrigatórios (CA4, CA9)" aparecem todos com ✓.
- **Força das asserções:** os testes passam pelo DOM real, com as rotas reais e o `authGuard`. Eles verificam o texto exato da mensagem, que ela pertence ao campo certo (pelo `aria-describedby`), que aparece uma vez só e o estado `disabled` do botão. Nenhum mock está testando a si mesmo. O caso `it.each` com um obrigatório de fora prova o bloqueio campo por campo, não só no conjunto.
- **Escopo:**
  - O select "Ponto" lista os pontos de todos os bairros (`ride-offer-form.ts:18-21`). Isso segue a decisão provisória do usuário e está marcado para a Tarefa 3 (CA10).
  - Não entrou nada de tarefas seguintes: sem min/max de vagas, sem validador de horário futuro, sem maxLength, sem envio, sem "Cancelar".
  - O botão "Publicar" sem handler é o mínimo que o CA9 exige.
  - Os atributos `aria-invalid` e `aria-describedby` só ligam cada mensagem ao seu campo. Não são comportamento novo.
- **Glossário:** `direction`, `neighborhoodId`, `pickupPointId`, `departureTime`, `notes`, `neighborhoods` e `pickupPoints` batem com o `docs/architecture.md` (seção 5). O controle `seats` já vinha da Tarefa 1 e segue o nome que o plan.md define, então não conta como divergência desta tarefa.
- **Abandono:** a spec não descreve nenhum caso de abandono para esta tarefa. Descarte, falha de rede e clique duplo ficam nas Tarefas 8, 9 e 10.

## Apontamentos


