# Parecer de Código: Tarefa 9

**Veredito:** APROVADO

Revisei o diff inteiro de `git diff 807ef6988c824a34343444eaadd90d858511ce00`. São três arquivos, todos dentro dos "Arquivos previstos". Rodei os testes e o lint pelo PowerShell, com `C:` maiúsculo:
- `npm test`: 16 arquivos e 110 testes, todos passando.
- `npm run lint` (`eslint .`): nenhum erro e nenhum aviso.

Não alterei nem gravei nenhum arquivo.

## Apontamentos (bloqueiam)
Nenhum.

O que conferi contra o `docs/architecture.md`:
- **Estado em signals (Seção 1, ID10):** `enviando = signal(false)` e `rotuloDoBotao = computed(...)` (`ride-offer-form.ts:69-74`). O plano também previa signals para o envio (`plan.md:29,31`).
- **Template com binding de mão única e signals (ID10, ID24):** `[disabled]="form.invalid || enviando()"` e `{{ rotuloDoBotao() }}` (`ride-offer-form.html:158,165`). Não há lógica de rótulo no template. O ternário que existia ali foi para o `computed`.
- **Data Layer Rule:** o componente continua falando com o servidor só pelo `RideOfferService.criar`. Não há `HttpClient` direto nem URL no código.
- **Erros:** nenhum é engolido. O ramo de erro desliga `enviando` e mantém a separação feita na Tarefa 8: `FalhaDeRedeError` liga `falhaDeRede`, e qualquer outro erro vai para o `ErrorHandler` (`ride-offer-form.ts:106-113`).
- **Nenhuma abstração nova:** não há service, diretiva ou componente compartilhado criado para um caso só. Procurei um estado de "envio em andamento" já existente em `features/` e `shared/` (`login.ts` só tem `emailNaoPermitido` e `falhaDeRede`). Não existe, então não há regra duplicada.
- **A guarda em `publicar()` cobre também o Enter** (`ride-offer-form.ts:84`): o `(ngSubmit)` do `<form>` (`html:11`) chama o método sem passar pelo botão desligado. Desligar só o botão não fecharia o segundo envio.
- **Testes presos ao comportamento, não à implementação** (`ride-offer-form.spec.ts:585-676`). Eles verificam o DOM (`disabled`, texto do botão), a URL do Router e o número de chamadas ao service mockado, que é a fronteira da camada. Não leem signals nem membros `protected` do componente. O helper `botaoDeEnvio` busca o botão por `button[type="submit"]`, não pelo texto. Está certo, porque o texto muda ("Publicar", "Publicando…", "Tentar novamente").

## Sugestões (não bloqueiam)
- **Navegação que falha depois do sucesso deixa o botão preso em "Publicando…"** (`ride-offer-form.ts:102-104`). Depois do sucesso, `enviando` fica ligado de propósito, e o comentário explica que a oferta já existe e não pode ser duplicada. Mas a rota de destino `ofertas/:id` é lazy (`app.routes.ts`, `loadComponent`). Se a rede cair entre a resposta do POST e o download desse chunk, o `router.navigate` rejeita. O `void` descarta essa rejeição, e o motorista fica num botão desligado "Publicando…" sem nenhum aviso. Manter o botão desligado é o lado seguro, porque evita a segunda oferta. Por isso isto é sugestão, não apontamento. Vale decidir se é preciso tratar o retorno de `navigate` (por exemplo, mostrar um aviso com link para a oferta), aqui ou numa Issue à parte.
- **O teste "com o formulário inválido, enviar pelo Enter não chama o service"** (`ride-offer-form.spec.ts:668-676`) cobre uma falha de CA9 (Enter com formulário inválido), não de CA12, e vai além do texto da Tarefa 9 no plano. O código está correto e ajuda (antes, os casts `direction as RideDirection` e `seats as number` dependiam só do botão desligado). Fica a nota para o revisor de conformidade e para o registro de decisões, sobre o que a tarefa passou a cobrir.

## Observações fora do escopo deste diff
- **A assinatura de `criar(nova)` não é desfeita quando o componente é destruído** (`ride-offer-form.ts:101`, que vem da Tarefa 7). Se o motorista sair da tela com o envio pendente, o `next` ainda navega para `/ofertas/<id>` quando o servidor responder, puxando-o de volta de onde ele foi. É candidato a Issue de manutenção, por exemplo com `takeUntilDestroyed` usando um `DestroyRef` injetado.
- **`FalhaDeRedeError` é importado de `core/services/auth.service`** (`ride-offer-form.ts:7`, também anterior a este diff). É um erro genérico de transporte que mora no service de autenticação. A camada está certa (feature importando core), mas o lugar natural seria `core/models` ou um arquivo próprio em `core/`. É candidato a Issue de manutenção.

Arquivos relevantes:
- `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts`
- `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html`
- `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts`
- `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.routes.ts` (referência da rota lazy na primeira sugestão)
