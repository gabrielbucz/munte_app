# Parecer de Código — Tarefa 7

**Veredito:** APROVADO

Testes e lint rodados pelo PowerShell (`C:\Users\Gabriel\Desktop\munte_app\apps\web`): `npm test` passou com 16 arquivos e 96 testes. `npm run lint` (`eslint .`) terminou sem erros. Os avisos de `localStorage is not available` já apareciam antes deste diff e não fazem nenhum teste falhar.

## Apontamentos (bloqueiam)

Nenhum.

Itens conferidos contra o `docs/architecture.md`:
- **Data Layer Rule (Seção 1) e regra imutável da Seção 8:** o componente não usa `HttpClient`. O `POST` fica em `RideOfferService.criar` (`core/services/ride-offer.service.ts:15-26`), e motorista, status, vagas disponíveis e `createdAt` também são montados ali. Na troca para o Supabase, só o service muda.
- **Injeção com `inject()` e service em `providedIn: 'root'` (Seção 1, ID15):** os dois são respeitados (`ride-offer-form.ts:17-18` e `ride-offer.service.ts:11`).
- **Regra de dependência (Seção 4):** `features/driver` importa só de `core/*`. `core/services` importa só de `core/models`, `core/config` e `core/services`.
- **URL de ambiente no código:** não há. A URL usa o `API_URL` de `core/config/api.config.ts`.
- **Contrato (Seções 5 e 8):** `rideOffers: []` entrou no `apps/api/db.json`. O corpo do POST segue o glossário do `RideOffer`, sem `vehicleId`, como o plano decidiu.
- **Abstração para um caso só:** `NovaRideOffer` (`core/models/ride-offer.ts:24-27`) é usado no service e no componente. É um `Pick` do `RideOffer`, sem campo novo, então não é indireção sem ganho. A troca do tipo literal pelo `RideDirection` no `FormControl` (`ride-offer-form.ts:26`) tira uma duplicação.
- **Acoplamento dos testes:** o spec do service confere o corpo do POST com `toStrictEqual`, que é o contrato com a API. O spec do formulário confere a chamada `criar(...)`, que é o contrato entre componente e service, e confere a URL final pelo `Router`, com as rotas reais. Os dois testam comportamento observável, não detalhes internos. O teste do horário monta o ISO esperado em hora local (`ride-offer-form.spec.ts`, perto da linha 437), então passa em qualquer fuso.

## Sugestões (não bloqueiam)

1. **`subscribe` só com `next` em `ride-offer-form.ts:83-85`.** Se o `POST` falhar, o erro vai para o tratamento global do RxJS e aparece só no console. O motorista não vê nada e o botão continua ligado. A falha não é engolida (ela aparece), e a Tarefa 8 já prevê esse tratamento. Mesmo assim, vale conferir na Tarefa 8 que todo erro chega à tela: o plano só cita `status 0` virando `FalhaDeRedeError`, e um 500 continuaria indo só para o console.

2. **Asserções de tipo em `ride-offer-form.ts:74` (`direction as RideDirection`) e `:79` (`seats as number`).** Elas dependem de o botão estar desligado com o formulário inválido (o comentário da linha 69 diz isso). Um `if (this.form.invalid) return;` no começo do `publicar()` tornaria essa garantia explícita e evitaria um `null` em `totalSeats` caso o `ngSubmit` seja disparado de outra forma. Isso ganha peso na Tarefa 9, quando a condição do botão mudar.

3. **`this.authService.sessao()!.email` em `ride-offer.service.ts:19`.** O service confia no `authGuard` de outra camada. Hoje isso funciona, porque o `AuthService` não tem logout e a sessão nunca volta a `null`. Quando houver logout ou expiração (#25), o `!` vira um `TypeError` síncrono dentro do handler de clique, fora do fluxo do Observable. Uma alternativa barata é devolver `throwError(() => ...)` quando não houver sessão. O plano escreve `sessao()?.email`.

4. **`let criar: ReturnType<typeof vi.fn>` em `ride-offer-form.spec.ts:47`.** O tipo fica genérico e o mock aceita qualquer assinatura. Tipar com a assinatura do service (algo como `Mock<(nova: NovaRideOffer) => Observable<RideOffer>>`) faria o compilador pegar uma mudança na assinatura de `criar`. Só deixa o teste mais legível e robusto.

## Observações fora do escopo deste diff

- **Horário que expira com a tela aberta:** `horarioFuturo` (`features/driver/ride-offer-form/horario-futuro.validator.ts:8`) só roda quando o valor muda. Se o motorista deixa a tela aberta até o horário digitado passar, o formulário continua válido e publica um horário no passado. Isso é de conformidade com o CA5, não de arquitetura. Pode virar Issue ou ser levado ao revisor de conformidade.
- **`db.json` versionado e gravado pelo json-server:** o `json-server --watch apps/api/db.json` grava no próprio arquivo do repositório. Com `rideOffers` (e `magicLinks`, que já existia), cada uso em desenvolvimento suja o `db.json` com dados de teste, que acabam indo para commit. É candidata a Issue de manutenção, por exemplo uma semente versionada copiada para um arquivo ignorado pelo git.
- **ID24 diferente do que está implementado:** o ID24 do `architecture.md` pede `[disabled]="form.invalid | form.pristine"` (com `|`, e incluindo `pristine`). O template usa `form.invalid` (`ride-offer-form.html:152`), e esta linha não foi alterada neste diff. Vale alinhar o documento no fechamento da Issue.

Arquivos revisados:
- `C:\Users\Gabriel\Desktop\munte_app\apps\api\db.json`
- `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\models\ride-offer.ts`
- `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\ride-offer.service.ts`
- `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\ride-offer.service.spec.ts`
- `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts`
- `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html`
- `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts`

Nenhum arquivo foi gravado. Gravar o parecer em `specs/3-us01-motorista-cadastra-oferta/reviews/tarefa-07-codigo-r<rodada>.md` fica com o fluxo.
