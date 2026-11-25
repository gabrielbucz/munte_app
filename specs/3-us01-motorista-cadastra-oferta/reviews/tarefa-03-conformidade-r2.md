# Parecer de Conformidade — Tarefa 3

**Veredito:** APROVADO

Esta é a rodada 2 de revisão. O apontamento aceito na rodada 1 está resolvido. Ele dizia que o teste de "trocar de bairro desmarca o ponto" passaria mesmo sem a limpeza do ponto (ver `tarefa-03-decisoes-r1.md`).

**Testes:** rodei pelo PowerShell com `C:` em maiúsculo. Passaram 13 arquivos e 71 testes, nenhum falhou.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA10 (1ª parte): "escolhi um bairro, quando abro o campo ponto, então vejo só os 3 pontos fixos daquele bairro" | atendido | **Código:** `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.ts:30-39`. O formulário observa o bairro escolhido (`toSignal` de `neighborhoodId.valueChanges`) e um `computed` com `find` devolve só os pontos desse bairro, ou nenhum ponto se o bairro estiver vazio. **Teste:** `ride-offer-form.spec.ts:281-289`, um `it.each` para Centro e para Vila Nova, que confere a lista exata dos 3 pontos com `toEqual`. Antes da tarefa esse teste falharia, porque o `computed` antigo juntava os pontos de todos os bairros com `flatMap` e listava 6. |
| CA10 (2ª parte): "se troco de bairro, o ponto escolhido antes é desmarcado" | atendido | **Código:** `ride-offer-form.ts:45-49`. Uma assinatura de `valueChanges` com `takeUntilDestroyed` chama `pickupPointId.reset('')`, como o usuário decidiu antes da implementação. **Teste:** `ride-offer-form.spec.ts:291-310`. Agora o teste preenche todos os campos com valores válidos, confere que "Publicar" está ligado, troca de Centro para Vila Nova e confere que "Publicar" desliga (linha 305). Sem o `reset('')`, o ponto continuaria `'1'` (válido) e o botão continuaria ligado, então o teste ficaria vermelho. A asserção prova o desmarque no próprio formulário, e não só o `<select>` aparecer vazio na tela. Como o teste marca o ponto como tocado (`sair(ponto)`) antes da troca, a ausência de `aria-invalid` e de `role="alert"` depois da troca também prova que o `reset` devolve o ponto ao estado de não tocado. Isso é coerente com o CA9 e com a decisão do usuário. |
| CA4/CA9 (Tarefa 2) continuam valendo | atendido | `ride-offer-form.spec.ts:240-261`. O caso "Bairro" saiu do `it.each` e virou um teste próprio (linha 251). Ele confere bairro vazio, ponto vazio e "Publicar" desligado, como o usuário registrou. Os outros quatro casos continuam no `it.each`. |
| Escopo: nada além do que a spec pede | atendido | O diff mexe só em `ride-offer-form.{ts,spec.ts}`, dentro dos arquivos previstos no plano. O `.html` não precisou mudar, porque já desenhava `pickupPoints()`. A reorganização dos helpers do teste para o nível do módulo não muda nenhum comportamento. |
| Glossário (`neighborhoodId`, `pickupPointId`, `pickupPoints`) | atendido | Os termos são os mesmos do plano e do modelo `Neighborhood`/`PickupPoint`. |

## Apontamentos

Arquivos relevantes:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html (sem mudança nesta tarefa)
- c:\Users\Gabriel\Desktop\munte_app\specs\3-us01-motorista-cadastra-oferta\spec.md (CA10, linha 37)

Este parecer deve ser gravado sem edição em `specs/3-us01-motorista-cadastra-oferta/reviews/tarefa-03-conformidade-r2.md`. Não gravei porque sou somente leitura.
