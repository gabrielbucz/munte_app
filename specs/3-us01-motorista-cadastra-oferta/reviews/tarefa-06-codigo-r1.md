# Parecer de Código: Tarefa 6

**Veredito:** APROVADO

Nada no diff bloqueia a tarefa. Li o `docs/architecture.md` inteiro e o diff inteiro (`git diff 57837ea4217762807016db80a1e4fb52ca9af300`). Também li o código que já existia e que o diff toca: `neighborhood.ts`, `neighborhood.service.ts`, `app.config.ts`, `ride-offer-form.*` e os pareceres anteriores. Rodei os testes e o lint pelo PowerShell com `C:` maiúsculo. O `npm test` passou 16 arquivos e 92 testes. O `npm run lint` (`eslint .`) terminou sem erro nem aviso.

## Apontamentos (bloqueiam)
Nenhum.

O que conferi contra a régua:
- **Data Layer Rule (seção 1) e regra de migração (seções 2 e 8):** o componente não usa o `HttpClient`. Ele busca a oferta pelo `RideOfferService.buscarPorId`, que é `providedIn: 'root'` e usa `inject(HttpClient)` (ID15). O `_expand` do json-server e a conversão do 404 em `null` ficam só no service, então o componente não conhece HTTP.
- **Regra de dependência (seção 4):** `features/driver/ride-offer-detail` importa só de `core/` (config, models, services). Nada em `core/` importa de `features/` ou de `shared/`.
- **Sintaxe (seção 1, ID6, ID10, ID16, ID17, ID25):**
  - o componente é standalone sem escrever `standalone: true` e usa `inject()`;
  - `id = input.required<string>()` e `publicada = input<string>()` são preenchidos pelo `withComponentInputBinding()`, que já está em `app.config.ts`;
  - o estado é um signal montado com `toSignal(toObservable(id).pipe(switchMap(...)))`;
  - o template usa `@if/@else if` e `@let`, sem `*ngIf`;
  - a rota é lazy com `loadComponent`;
  - o horário usa o `DatePipe` nativo (ID8), como o plano decidiu.
- **Ordem das rotas:** `ofertas/:id` vem depois de `ofertas/nova`, como o plano pede, e há um comentário explicando o motivo. A rota não tem guard, também como o plano decidiu.
- **Segredo ou URL de ambiente:** o diff não acrescenta nenhum. `PONTO_NA_FACULDADE` é um dado provisório de domínio e está marcado com `TODO #35`.
- **Erro engolido:** não há. No service (`ride-offer.service.ts:19-24`), só o 404 vira `null`. Qualquer outro erro sai com `throwError`, e um teste com status 500 prova isso (`ride-offer.service.spec.ts:62-70`).
- **Abstração sem ganho:** não há. `RideOfferDetalhada` é o formato que o componente de fato consome. O `encodeURIComponent(id)` protege a URL de um id digitado no endereço.
- **Duplicação:** procurei no repositório. Não havia service de oferta, pipe de data nem rótulo de sentido antes deste diff. O `RideDirection` é novo e é o mesmo do glossário.
- **Testes presos à implementação:**
  - o teste do service compara a URL por predicado e confere os parâmetros com `getAll('_expand')`, então não quebra se a ordem dos parâmetros mudar;
  - o teste do componente usa as rotas reais e o `RouterTestingHarness`, e procura os dados pelo rótulo do `<dt>`, por `role="status"`/`role="alert"` e pelo `href` do link. Não olha o estado interno do componente;
  - o horário é montado em hora local, então o texto formatado não depende do fuso da máquina.

## Sugestões (não bloqueiam)
- **Erro diferente de 404 deixa a tela em branco.** Em `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-detail\ride-offer-detail.ts:22-24`, o `toSignal` não trata erro. Se o json-server estiver parado (status 0) ou responder 500, acontece o seguinte:
  - o `toSignal` lança o erro sempre que `oferta()` é lido no template, e o `ErrorHandler` registra esse erro a cada detecção de mudanças;
  - o aluno vê só o `<section>` vazio, sem nenhuma mensagem;
  - a ligação com `switchMap` morre, então uma mudança de `id` depois disso não busca mais nada.

  Não reprova, porque a falha não fica escondida (o `ErrorHandler` registra) e nenhum CA da spec cobre falha de rede nesta tela. É o mesmo padrão da sugestão sobre os bairros na Tarefa 1. Cabe ao usuário decidir se isso vira critério ou Issue.
- **Constante de domínio num arquivo de API.** `PONTO_NA_FACULDADE` está em `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\config\api.config.ts:5`. Esse arquivo é sobre a API, e ainda vai mudar com a #25 (Supabase). O plano só pedia "em `core/config/`". Um arquivo próprio, por exemplo `core/config/pontos.config.ts`, deixaria a #25 e a #35 cada uma no seu arquivo. O plano listou `api.config.ts` entre os arquivos previstos, por isso fica como sugestão.
- **O comentário do modelo amarra o contrato ao json-server.** Em `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\models\ride-offer.ts:22`, o comentário diz "A oferta como volta do _expand do json-server". O tipo em si é neutro: com o Supabase, o service pode montar o mesmo formato com um `select` que traga o bairro e o ponto. Mas o comentário sugere que o modelo é o formato do json-server, e a seção 8 diz que só o service conhece a fonte dos dados. Uma frase como "oferta com o bairro e o ponto já resolvidos" descreveria o contrato sem citar a fonte.
- **Rótulo errado num teste.** O teste do 500 em `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\ride-offer.service.spec.ts:62` está marcado como `CA14:`, mas o CA14 trata só de oferta inexistente. Esse teste prova uma decisão técnica (só o 404 vira `null`). O rótulo pode confundir o revisor de conformidade e a defesa.
- **Rótulos Ida/Volta em dois lugares.** O template do detalhe (`ride-offer-detail.html:11`) traduz `outbound`/`return` para "Ida"/"Volta" com um ternário, e o formulário (`ride-offer-form.html:19-24`) repete os mesmos rótulos. Com dois usos e nenhum pipe ainda, não vale criar uma abstração agora. Se uma terceira tela precisar (US02 ou US05), um pipe em `shared/pipes/` (o "statusLabel" do ID8) resolve.

## Observações fora do escopo deste diff
- **Tipo do sentido ainda escrito à mão no formulário.** `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts:20` continua com `'outbound' | 'return' | ''`. Agora que o `RideDirection` existe em `core/models/ride-offer.ts`, dá para trocar por `RideDirection | ''`, como a sugestão da Tarefa 1 previa. O diff não tocou nessa linha, então pode entrar na Tarefa 7, que mexe no formulário, ou virar manutenção.
- **Documentação.** A seção 4 do `docs/architecture.md` não lista `core/config/`. O `RideOffer` do código não tem `vehicleId` e tem `notes` obrigatório, enquanto o glossário tem `notes?`. O plano já prevê acertar isso no fechamento.
- **URL do json-server no código.** `API_URL` continua escrita em `api.config.ts`. Isso é de antes desta tarefa e já está marcado com `TODO #25`.

Arquivos revisados:
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.routes.ts`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\config\api.config.ts`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\models\ride-offer.ts`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\ride-offer.service.ts`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\ride-offer.service.spec.ts`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-detail\ride-offer-detail.ts`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-detail\ride-offer-detail.html`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-detail\ride-offer-detail.spec.ts`

Não gravei nenhum arquivo. Gravar este parecer em `c:\Users\Gabriel\Desktop\munte_app\specs\3-us01-motorista-cadastra-oferta\reviews\tarefa-06-codigo-r1.md` fica a cargo do fluxo.
