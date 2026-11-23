# Parecer de Conformidade — Tarefa 3

**Veredito:** APONTAMENTOS

O comportamento implementado cumpre o CA10, mas o teste da segunda metade do critério ("se troco de bairro, o ponto escolhido antes é desmarcado") não prova o que diz provar. Ele continuaria passando se a limpeza do ponto fosse apagada.

Testes: rodei pelo PowerShell com `C:` em maiúsculo. Passaram 13 arquivos de teste e 71 testes, nenhum falhou.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA10 (1ª parte): escolhido um bairro, o campo ponto mostra só os 3 pontos fixos dele | atendido | `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.ts:30-39` (`toSignal` de `valueChanges` + `computed` com `find`); teste em `ride-offer-form.spec.ts` no `it.each` de Centro e Vila Nova (~linhas 279-288). Antes ele falharia, porque o `computed` antigo listava os pontos de todos os bairros com `flatMap`. |
| CA10 (2ª parte): trocar de bairro desmarca o ponto escolhido antes | atendido no código; **o teste não prova** (apontamento 1) | `ride-offer-form.ts:45-49` (`valueChanges` + `takeUntilDestroyed` + `pickupPointId.reset('')`); teste em `ride-offer-form.spec.ts:290-305` |
| CA4/CA9 (da Tarefa 2): continuam valendo depois da mudança | atendido | `ride-offer-form.spec.ts` (~linhas 239-258): o caso "Bairro" saiu do `it.each` e virou um teste próprio, que confere que bairro e ponto estão vazios e "Publicar" está desligado. Isso bate com a decisão registrada pelo usuário. |
| Escopo: nenhum comportamento além do que a spec pede | atendido | O diff mexe só em `ride-offer-form.{ts,spec.ts}`, como o plano prevê. O `.html` não precisou mudar, porque já desenhava `pickupPoints()`. O `reset('')` deixar o ponto como não tocado foi decisão do usuário e é coerente com o CA9. |
| Glossário (`neighborhoodId`, `pickupPointId`, `pickupPoints`) | atendido | Mesmos termos do plano e do modelo `Neighborhood`/`PickupPoint` |

## Apontamentos
1. **O teste de "trocar de bairro desmarca o ponto" passaria mesmo sem a limpeza do ponto** — `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.spec.ts:290-305` (a asserção principal é a da linha 301, `expect(ponto.value).toBe('')`)
   Critério violado: CA10 — "se troco de bairro, o ponto escolhido antes é desmarcado". Item do "O que reprova": "teste que não prova o critério que diz provar (asserção fraca)".
   Evidência: o teste olha só o `value` do `<select>` na tela (linha 301), o `aria-invalid` e a ausência de `role="alert"`. Nenhuma dessas verificações depende do `subscribe(() => pickupPointId.reset(''))` em `ride-offer-form.ts:45-49`:
   - Quando o bairro muda de Centro para Vila Nova, o `@for` remove as `<option>` do Centro. No Angular 21.2 (`node_modules/@angular/forms/fesm2022/forms.mjs:4242-4245`), `NgSelectOption.ngOnDestroy` apaga a opção e chama `_writeValueAfterRender()`. Isso escreve de novo o valor do modelo (`'1'`) no `<select>`. Como nenhuma opção restante tem esse valor, o elemento passa a mostrar `value === ''`.
   - Ou seja, o campo aparece vazio na tela mesmo que o controle continue com `pickupPointId = '1'` (Praça central, que é do Centro).
   - Nesse cenário o controle segue válido, então `aria-invalid` fica nulo e não aparece alerta. As outras duas asserções também passam.
   - Resultado: se alguém tirar a limpeza, o teste continua verde, e o formulário aceita publicar Vila Nova com um ponto do Centro, justamente o que o CA10 proíbe.

   Não rodei essa mutação, porque sou somente leitura. A conclusão vem da leitura do fonte do Angular instalado.

   Para o teste provar o desmarque, ele precisa observar algo que só muda quando o modelo é limpo. Um exemplo: preencher todos os outros campos com valores válidos, escolher bairro e ponto, conferir que "Publicar" liga, trocar o bairro e conferir que "Publicar" desliga. Como corrigir fica a critério da triagem e do implementador.

Arquivos relevantes:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html (sem mudança nesta tarefa)
- c:\Users\Gabriel\Desktop\munte_app\specs\3-us01-motorista-cadastra-oferta\spec.md (CA10, linha 37)

Este parecer deve ser gravado sem edição em `specs/3-us01-motorista-cadastra-oferta/reviews/tarefa-03-conformidade-r1.md` (pelo número da rodada que estiver valendo). Eu não gravei, porque sou somente leitura.
