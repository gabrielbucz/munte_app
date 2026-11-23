# Plano — Issue #3

## Decisões técnicas

**Dados (json-server, `apps/api/db.json`)**
- Duas coleções novas, seguindo o ER do `docs/architecture.md` (seção 6) e a lista de arrays da seção 8:
  - `neighborhoods`: `{ id, name }` — 3 bairros de exemplo (`// TODO #35` onde o dado é consumido; o JSON não aceita comentário).
  - `pickupPoints`: `{ id, neighborhoodId, label, order }` — 3 por bairro.
- Coleção `rideOffers`, que nasce vazia. Contrato de cada oferta: `{ id, driverId, direction, neighborhoodId, pickupPointId, departureTime, totalSeats, availableSeats, status, notes, createdAt }`.
  - `driverId` = e-mail da sessão da US12 (`AuthService.sessao()?.email`) — `// TODO #25`.
  - `direction`: `'outbound'` (Ida) | `'return'` (Volta), como o `RideDirection` do glossário técnico.
  - `departureTime` e `createdAt` em ISO; `availableSeats` nasce igual a `totalSeats`; `status` nasce `'available'` (o "Disponível" do CA1); `notes` é `''` quando vazio.
  - Sem `vehicleId`: o veículo é da US14. A diferença em relação ao `RideOffer` do glossário é registrada no `architecture.md` no fechamento.
- O ponto na faculdade é uma constante provisória `PONTO_NA_FACULDADE = 'Portão principal da UTFPR'` em `core/config/`, com `// TODO #35`.

**Modelos (`core/models/`)**
- `ride-offer.ts`: `RideOffer`, `NovaRideOffer` (o que o formulário entrega) e `RideDirection`.
- `neighborhood.ts`: `Neighborhood` e `PickupPoint`.

**Services (`core/services/`, `providedIn: 'root'`, `inject(HttpClient)`)**
- `NeighborhoodService.listar()`: `GET /neighborhoods?_embed=pickupPoints` → bairros já com os seus pontos (o `_embed` do json-server 0.17).
- `RideOfferService.criar(nova)`: monta a oferta completa (motorista, status, vagas disponíveis, `createdAt`) e faz `POST /rideOffers`; devolve a oferta criada (com o `id` do json-server). Falha com `status === 0` vira `FalhaDeRedeError` (a mesma classe que o `AuthService` já exporta), para o componente não conhecer HTTP.
- `RideOfferService.buscarPorId(id)`: `GET /rideOffers/:id?_expand=neighborhood&_expand=pickupPoint`; 404 vira `null`.

**Telas (`features/driver/`, standalone, lazy)**
- `ride-offer-form/` — classe `RideOfferForm`, rota `ofertas/nova` com `canActivate: [authGuard]` (CA13).
  - Reactive Forms (ID24), com `FormGroup` tipado e `nonNullable`: `direction`, `neighborhoodId`, `pickupPointId`, `departureTime` (`<input type="datetime-local">`), `seats` (`<input type="number">`), `notes`.
  - Validadores: `Validators.required` em todos menos `notes`; `seats` com `Validators.min(1)` e `Validators.max(4)`; `notes` com `Validators.maxLength(200)`; `departureTime` com um validador próprio `horarioFuturo` (arquivo `horario-futuro.validator.ts` na mesma pasta), que compara com `Date.now()` — testável com relógio simulado.
  - Mensagem de cada campo só quando `control.invalid && control.touched` (CA9). Botão "Publicar": `[disabled]="form.invalid || enviando()"`.
  - Pontos do bairro: `toSignal(form.controls.neighborhoodId.valueChanges)` + `computed` com os pontos do bairro escolhido (ID25 e ID10); trocar o bairro zera `pickupPointId` (CA10).
  - Estado do envio em signals: `enviando`, `falhaDeRede`.
  - Sucesso: `router.navigate(['/ofertas', oferta.id], { queryParams: { publicada: 1 } })`.
- `ride-offer-detail/` — classe `RideOfferDetail`, rota `ofertas/:id` (sem guard: nenhum critério pede).
  - `id = input.required<string>()` e `publicada = input<string>()`, via `withComponentInputBinding()`, que já está ligado (ID16 e ID17).
  - Mostra sentido (Ida/Volta), trajeto com o bairro, o ponto e o `PONTO_NA_FACULDADE`, horário formatado com o `DatePipe` (`dd/MM 'às' HH:mm`, ID8), vagas e observações. O aviso "Oferta publicada." aparece só com `publicada`. Com `null` do service: "Oferta não encontrada." e link para `/inicio` (CA14).
- **Rotas:** `ofertas/nova` vem **antes** de `ofertas/:id` em `app.routes.ts`, senão "nova" seria lida como um id.

**Descarte (CA6)**
- Guard funcional `confirmarDescarteGuard: CanDeactivateFn<PodeSair>` em `core/guards/`. O componente implementa `podeSair(): boolean`.
- A pergunta usa o diálogo nativo `window.confirm(...)` com o texto da spec. Os testes simulam a resposta com `vi.spyOn(window, 'confirm')`.
- `podeSair()` devolve `true` sem perguntar quando o formulário está intocado (`pristine`), depois de uma publicação bem-sucedida ou depois de um descarte já confirmado pelo "Cancelar". Assim a pergunta não aparece duas vezes.
- "Cancelar": formulário intocado → vai para `/inicio`; alterado → `confirm`; confirmando → `/inicio`; recusando → fica.

**Navegação (CA15)**
- O `Header` (`shared/components/`) ganha o link `{ rotulo: 'Oferecer carona', caminho: '/ofertas/nova' }` na lista que já existe. O link aparece sempre: o `Header` é um componente burro e não pode importar `core/` (regra de dependência). Sem sessão, o guard leva à tela Entrar (CA13).

**Documentação a atualizar no fechamento**
- `docs/architecture.md`: coleção `rideOffers` sem `vehicleId` até a US14, `features/driver/` em uso, `core/models/` criado, guard `confirmarDescarteGuard`.

## Tarefas

- [x] **Tarefa 1 — abrir o formulário de nova oferta pela navegação, só com sessão**
  - Cobre: CA13, CA15
  - Teste primeiro: `neighborhood.service.spec.ts` prova o `GET /neighborhoods?_embed=pickupPoints`; `header.spec.ts` prova o link "Oferecer carona" para `/ofertas/nova`; `ride-offer-form.spec.ts` prova, com as rotas reais, que sem sessão `/ofertas/nova` termina em `/entrar` e que com sessão a tela mostra os campos sentido, bairro (com os bairros do service), ponto, horário, vagas e observações. Falha antes porque a rota, o componente, o service e o link não existem.
  - Arquivos previstos: `apps/api/db.json`, `core/models/neighborhood.ts`, `core/services/neighborhood.service.{ts,spec.ts}`, `features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`, `shared/components/header/header.{ts,spec.ts}`, `app.routes.ts`

- [ ] **Tarefa 2 — exigir os campos obrigatórios, com a mensagem só depois de tocar**
  - Cobre: CA4, CA9
  - Teste primeiro: `ride-offer-form.spec.ts` prova que, com a tela recém-aberta, nenhuma mensagem aparece e "Publicar" está desligado; que sair de cada campo obrigatório vazio mostra "preenchimento obrigatório"; que com todos preenchidos (valores válidos) o botão liga; e que observações vazias não bloqueiam. Falha antes porque não há validadores nem mensagens.
  - Arquivos previstos: `features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`

- [ ] **Tarefa 3 — mostrar só os pontos do bairro escolhido**
  - Cobre: CA10
  - Teste primeiro: `ride-offer-form.spec.ts` prova que, escolhido um bairro, o campo ponto lista só os 3 pontos dele; e que trocar de bairro desmarca o ponto escolhido antes. Falha antes porque o campo ponto não depende do bairro.
  - Arquivos previstos: `features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`

- [ ] **Tarefa 4 — limitar as vagas entre 1 e 4**
  - Cobre: CA3, CA7
  - Teste primeiro: `ride-offer-form.spec.ts` prova, para cada regra, o par aceita/recusa: 1 e 4 passam; 0 e -1 mostram "mínimo 1 vaga"; 5 mostra "máximo 4 vagas"; e o botão fica desligado nos recusados. Falha antes porque `seats` só é obrigatório.
  - Arquivos previstos: `features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`

- [ ] **Tarefa 5 — recusar horário no passado e observações longas**
  - Cobre: CA5, CA8
  - Teste primeiro: `horario-futuro.validator.spec.ts` (com relógio simulado) prova que um instante depois de agora passa e que agora e o passado são recusados; `ride-offer-form.spec.ts` prova a mensagem "precisa ser no futuro" e, para observações, que 200 caracteres passam e 201 mostram "máximo 200 caracteres". Falha antes porque não há validador de horário nem limite de tamanho.
  - Arquivos previstos: `features/driver/ride-offer-form/horario-futuro.validator.{ts,spec.ts}`, `features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`

- [ ] **Tarefa 6 — mostrar a oferta pelo endereço `/ofertas/<id>`**
  - Cobre: CA2 (visíveis nos detalhes), CA14
  - Teste primeiro: `ride-offer.service.spec.ts` prova o `GET /rideOffers/:id` com `_expand` e que 404 vira `null`; `ride-offer-detail.spec.ts` prova, com as rotas reais, que `/ofertas/<id>` mostra sentido, bairro, ponto, horário formatado, vagas e observações, que o aviso "Oferta publicada." só aparece com `publicada`, e que um id desconhecido mostra "Oferta não encontrada." com link para `/inicio`. Falha antes porque o service, a rota e o componente não existem.
  - Arquivos previstos: `core/models/ride-offer.ts`, `core/config/api.config.ts`, `core/services/ride-offer.service.{ts,spec.ts}`, `features/driver/ride-offer-detail/ride-offer-detail.{ts,html,spec.ts}`, `app.routes.ts`

- [ ] **Tarefa 7 — publicar a oferta e levar o motorista aos detalhes**
  - Cobre: CA1, CA2 (ficam salvos)
  - Teste primeiro: `ride-offer.service.spec.ts` prova que `criar` faz `POST /rideOffers` com o motorista da sessão, `status: 'available'`, `availableSeats` igual a `totalSeats`, as observações e `createdAt`; `ride-offer-form.spec.ts` prova que publicar um formulário válido chama o service com os dados digitados e navega para `/ofertas/<id>?publicada=1`. Falha antes porque não há `criar` nem envio.
  - Arquivos previstos: `apps/api/db.json` (a coleção `rideOffers: []`, para o `POST /rideOffers` do json-server existir), `core/services/ride-offer.service.{ts,spec.ts}`, `features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`

- [ ] **Tarefa 8 — avisar quando o servidor não responde, sem perder o que foi digitado**
  - Cobre: CA11
  - Teste primeiro: `ride-offer.service.spec.ts` prova que `status 0` vira `FalhaDeRedeError`; `ride-offer-form.spec.ts` prova que, com o service falhando, aparece "Não foi possível publicar a oferta. Verifique sua conexão e tente novamente.", os campos mantêm os valores e "Tentar novamente" reenvia. Falha antes porque a falha não é tratada.
  - Arquivos previstos: `core/services/ride-offer.service.{ts,spec.ts}`, `features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`

- [ ] **Tarefa 9 — impedir a segunda oferta no clique duplo**
  - Cobre: CA12
  - Teste primeiro: `ride-offer-form.spec.ts` prova que, com o envio pendente (um `Subject` que ainda não emitiu), o botão está desligado com "Publicando…" e um segundo clique não chama o service de novo; e que o botão volta ao normal depois de uma falha. Falha antes porque não existe estado de envio.
  - Arquivos previstos: `features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`

- [ ] **Tarefa 10 — confirmar o descarte de um cadastro pela metade**
  - Cobre: CA6
  - Teste primeiro: `confirmar-descarte.guard.spec.ts` prova que o guard libera quando `podeSair()` é verdadeiro e pergunta quando não é; `ride-offer-form.spec.ts` prova que, com o formulário alterado, "Cancelar" e a saída por link perguntam "Descartar esta oferta? O que você preencheu será perdido." — confirmando, nada é enviado e a tela vai para `/inicio`; recusando, os valores continuam — e que, com o formulário intocado ou depois de publicar, sair não pergunta. Falha antes porque não há guard nem "Cancelar".
  - Arquivos previstos: `core/guards/confirmar-descarte.guard.{ts,spec.ts}`, `features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`, `app.routes.ts`

## Critérios sem tarefa

