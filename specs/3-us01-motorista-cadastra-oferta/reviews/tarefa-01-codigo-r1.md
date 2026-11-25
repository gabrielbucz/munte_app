# Parecer de Código: Tarefa 1

**Veredito:** APROVADO

Nada no diff bloqueia. Testes e lint passam: no PowerShell, com `C:` maiúsculo, `npm test` deu 13 arquivos e 55 testes aprovados, e `npm run lint` terminou sem nenhum erro nem aviso.

## Apontamentos (bloqueiam)
Nenhum.

Conferi o diff contra `docs/architecture.md` e está tudo de acordo:
- **Camadas (Data Layer Rule):** o componente não toca no `HttpClient`. O acesso passa pelo `NeighborhoodService`, que é `providedIn: 'root'` e usa `inject(HttpClient)` (ID15). O `_embed`, que é coisa do json-server, ficou só no service, como pede a regra de migração (seções 2 e 8).
- **Regra de dependência (seção 4):** `features/driver` importa só de `core/`. O `Header`, em `shared/`, continua sem importar `core/`. Por isso o link aparece sempre e quem barra o acesso sem sessão é o `authGuard`, como diz o plano.
- **Sintaxe:** os componentes são standalone sem escrever `standalone: true`, usam `inject()` e não construtor, listas com `@for` e `track`, estado em signal via `toSignal` (ID25) e rota lazy com `loadComponent` e `canActivate: [authGuard]` (ID18/ID19).
- **Modelos e dados:** `Neighborhood` e `PickupPoint` ficam em `core/models/` e batem com o glossário. `lat` e `lng` são opcionais no glossário e foram omitidos. O `db.json` traz as coleções `neighborhoods` e `pickupPoints` como manda a seção 8.
- **Versão do json-server:** o comentário no service fala em json-server 0.17, e isso bate com o `package-lock.json` (0.17.4).
- **Testes:** acham os campos pelo rótulo (`label`/`for`), pela legenda do `fieldset` e pelo texto do link, e não por classe CSS nem por estado interno. O teste do service casa a URL e o parâmetro `_embed` por predicado, então não quebra se a ordem dos parâmetros mudar. O CA13 roda com as rotas reais e o guard real.
- **Formulário:** usa `new FormGroup` tipado, e não o `FormBuilder` citado no ID24. É o mesmo padrão do `features/auth/login/login.ts`, já está na `develop` e o plano aprovado prevê isso, então não aponto.

## Sugestões (não bloqueiam)
- **Falha ao carregar os bairros:** em `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts:13-15`, o `toSignal` não tem caminho para erro. Se o `GET /neighborhoods` falhar (por exemplo, com o json-server parado), o `toSignal` lança o erro toda vez que `neighborhoods()` é lido no template, a cada detecção de mudanças. O `ErrorHandler` registra o erro repetidamente e o motorista vê o select "Bairro" vazio, sem nenhuma mensagem. A falha não é engolida (ela aparece no `ErrorHandler`), por isso não reprova. Mas nenhum CA da spec cobre esse caso: vale levar ao usuário para decidir se vira critério ou Issue.
- **Tipo do sentido escrito no componente:** em `ride-offer-form.ts:19`, o tipo `'outbound' | 'return' | ''` está escrito à mão. Quando as Tarefas 6 e 7 criarem `RideDirection` em `core/models/ride-offer.ts`, troque por `RideDirection | ''`. Senão, o enum do glossário passa a existir em dois lugares.
- **Classes Tailwind repetidas:** em `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html`, a mesma sequência de classes de campo aparece 5 vezes, e também está no `login.html`. Com as mensagens de erro da Tarefa 2, a repetição tende a crescer. Vale avaliar um componente de campo em `shared/components/` (ID5), mas não agora, só por estilo.

## Observações fora do escopo deste diff
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\config\api.config.ts` tem a URL do json-server escrita no código. Isso já existia antes desta tarefa e já está marcado com `TODO #25`.
- A seção 4 do `docs/architecture.md` não lista a pasta `core/config/`, que já existe no repositório. Dá para acertar junto com a atualização de documentação que o plano prevê para o fechamento.
- O `Header` mostra o link "Entrar" mesmo com o aluno já logado. Isso vem de antes desta tarefa (US12) e pode virar uma Issue de manutenção, se a equipe achar que é um problema.
- O `AuthService` declara os modelos `MagicLink` e `Sessao` dentro do próprio service, e não em `core/models/`. Também vem de antes desta tarefa.
