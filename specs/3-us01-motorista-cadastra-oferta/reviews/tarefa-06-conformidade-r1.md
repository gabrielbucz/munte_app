# Parecer de Conformidade — Tarefa 6

**Veredito:** APROVADO

Não encontrei nenhum apontamento bloqueante. A suíte inteira passa: 16 arquivos de teste e 92 testes, rodando `ng test --watch=false` pelo PowerShell com `C:` maiúsculo. Entre eles estão os 9 testes novos desta tarefa: 3 em `ride-offer.service.spec.ts` e 6 em `ride-offer-detail.spec.ts`. Conferi um por um com o reporter verbose.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA2, parte dos detalhes: a tela `/ofertas/<id>` mostra sentido (Ida ou Volta), bairro, ponto, horário, vagas e observações | atendido | `apps/web/src/app/features/driver/ride-offer-detail/ride-offer-detail.html:8-46`; teste em `ride-offer-detail.spec.ts:61-74` confere cada valor no `<dd>` do seu `<dt>`, com o horário formatado `01/12 às 07:30` e montado em hora local, então não depende do fuso |
| CA2: o sentido Volta aparece como "Volta" | atendido | `ride-offer-detail.html:11`; teste em `ride-offer-detail.spec.ts:76-83` |
| CA2: "Observações são opcionais" | atendido | `ride-offer-detail.html:39-44`: sem observações, a linha não aparece; teste em `ride-offer-detail.spec.ts:85-92` |
| CA2: os dados vêm do servidor com `GET /rideOffers/:id?_expand=neighborhood&_expand=pickupPoint` | atendido | `apps/web/src/app/core/services/ride-offer.service.ts:13-25`; teste em `ride-offer.service.spec.ts:42-51` confere a URL, o método e os dois `_expand` |
| CA1, só o aviso (o resto do CA1 é da Tarefa 7): "Oferta publicada." aparece só com `publicada` | atendido | `ride-offer-detail.html:3-5` e `ride-offer-detail.ts:20`; testes em `ride-offer-detail.spec.ts:94-105`, um com e outro sem `?publicada` |
| CA14: com id desconhecido aparece "Oferta não encontrada." e um link para a tela Início | atendido | `ride-offer-detail.html:46-55`; o 404 vira `null` em `ride-offer.service.ts:19-23`; testes em `ride-offer.service.spec.ts:53-61` (o 404 vira null) e `ride-offer-detail.spec.ts:107-120` (a mensagem, `href="/inicio"` e nenhum `<dl>` na tela) |
| Abandono: "abre um endereço de oferta inválido ou de uma oferta que não existe mais", e a tela avisa em vez de ficar vazia | atendido | mesmo caminho do CA14 (o json-server responde 404 para id inexistente) |
| Rota `ofertas/:id` depois de `ofertas/nova`, sem guard | atendido | `apps/web/src/app/app.routes.ts:26-33` |
| Termos do glossário (`docs/architecture.md:92-95`): `RideOffer`, `RideDirection`, status `'draft' / 'available' / 'full' / 'cancelled' / 'completed'` | atendido | `apps/web/src/app/core/models/ride-offer.ts`; a falta de `vehicleId` está prevista no plan.md e vai para o `architecture.md` no fechamento |
| CA1 (gravar com o status "Disponível"), CA2 (dados "ficam salvos"), CA3-CA13, CA15 | fora desta tarefa | Tarefas 1-5 (já feitas) e 7-10 |

## Escopo
Os 8 arquivos do diff são exatamente os previstos na Tarefa 6: `core/models/ride-offer.ts`, `core/config/api.config.ts`, `core/services/ride-offer.service.{ts,spec.ts}`, `features/driver/ride-offer-detail/ride-offer-detail.{ts,html,spec.ts}` e `app.routes.ts`. Não há `criar`, POST nem mudança no formulário, que são da Tarefa 7.

Há duas coisas que o texto da spec não cita, mas que vêm das decisões técnicas do plan.md já aprovado:
- a linha "Trajeto" com o `PONTO_NA_FACULDADE`;
- a constante `PONTO_NA_FACULDADE`, com `// TODO #35`.

Por isso não contam como escopo inflado.

## Apontamentos

Nenhum.

Uma observação que não bloqueia e não falha na conformidade: um erro diferente de 404, como 500 ou servidor fora do ar, sai do service sem tratamento (`ride-offer.service.ts:22`, teste em `ride-offer.service.spec.ts:63-70`), e a tela não mostra nenhum aviso para esse caso. A spec não pede tratamento disso na tela da oferta: o CA11 e a seção "Abandono no meio" falam só da falha ao publicar. Por isso não é apontamento. Se a equipe quiser cobrir esse caso, ele fica para uma nova Issue.
