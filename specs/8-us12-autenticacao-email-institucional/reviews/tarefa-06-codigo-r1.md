# Parecer de Código: Tarefa 6

**Veredito:** APROVADO

Não há apontamentos bloqueantes. Há quatro sugestões, e nenhuma delas bloqueia.

Revisei o diff do índice contra `62c161a` (`git diff 62c161a38b1e643bbef30cf9f639225bbfddb077`). Ele mexe em `auth.service.ts`, `auth.service.spec.ts`, `login.ts`, `login.html` e `login.spec.ts`. Rodei as verificações no PowerShell:
- `npm test`: 7 arquivos, 32 testes, todos passando.
- `npm run lint`: limpo, sem nenhum aviso.

## Apontamentos (bloqueiam)

Nenhum.

O que conferi e está de acordo com a régua:
- **Camada de dados (Seção 1 e Regra de migração da Seção 2):** só o `AuthService` conhece o `HttpErrorResponse` e o status 0 (`auth.service.ts:52-61`). O componente reage apenas a erros de domínio (`EmailNaoPermitidoError` e `FalhaDeRedeError`). Isso segue a regra de que a troca json-server para Supabase "atinge apenas os Services". Na Entrega 3, o `signInWithOtp` não passa pelo `HttpClient`, e o componente não precisa mudar.
- **Dependências (Seção 4):** `features/` importa de `core/`, e `core/` não importa de `features/` nem de `shared/`.
- **Sintaxe Angular (Seção 1, ID6, ID10, regra 01):** usa `@if`, `inject()` e `signal()`. Não há `any`, e o erro chega tipado como `unknown`.
- **Erro não é engolido em silêncio:**
  - A falha de rede aparece na tela com `role="alert"`, como decidido em D2 e S3.
  - Os demais erros, incluindo 4xx e 5xx, vão ao `ErrorHandler` (`login.ts:45`), como decidido em D1b.
  - O 500 continua sendo `HttpErrorResponse`, e há teste para isso (`auth.service.spec.ts:72-83`).
- **Tokens (ID5, regra 01):** só usa `text-perigo` e as classes que já existiam. Não há valor de cor solto.
- **Sem segredo nem URL nova no código:** a URL continua vindo de `API_URL`.
- **Sem abstração desnecessária:** o helper privado `falhaDeRede` dá nome à regra "status 0". Não acrescenta indireção, e o comentário explica o porquê.
- **Testes:**
  - O teste do service simula a falha real com `.error(new ProgressEvent('error'))`, que produz status 0. Não é um mock do próprio service.
  - O teste da tela confere o comportamento visível: texto do alerta, rótulo do botão, e-mail mantido e nova tentativa com sucesso.
  - A sugestão da revisão de código r1 da Tarefa 5 foi adotada: agora o teste busca o alerta pelo texto (`alertaComTexto`), sem depender de que exista um único `[role="alert"]`.

## Sugestões (não bloqueiam)

- **Guardar o erro original na `FalhaDeRedeError`** (`auth.service.ts:24-28` e `53`). Hoje o `HttpErrorResponse` original é descartado. Pela D2, ele também não vai ao `ErrorHandler`. Assim, não sobra nenhum registro técnico da falha (URL, `statusText`) para diagnosticar depois. O target é ES2022 (`apps/web/tsconfig.json:15`), então daria para fazer `constructor(cause?: unknown) { super('falha de rede', { cause }); ... }` e `new FalhaDeRedeError(erro)`. A mensagem e o comportamento da tela não mudam.
- **O teste fixa a estrutura de um único botão** (`login.spec.ts:207`, `toHaveLength(1)`). A linha protege a D3, o que é legítimo. Mas, se a equipe um dia trocar para um botão separado, o teste quebra sem que o CA6 tenha regredido. Se a D3 for só uma decisão de implementação, e não um requisito, a linha pode sair. Se for um requisito, vale deixar escrito no título do teste.
- **Duplicação pequena no spec da tela.** O novo helper `campoEmail` (`login.spec.ts:82-86`) repete a mesma busca já feita em `digitarEmail` (`:42-43`) e em `:148` e `:161`. Usar `campoEmail` nesses pontos deixaria um único lugar para trocar o seletor.
- **O teste "erro que não é de e-mail nem de rede" usa um `HttpErrorResponse`** (`login.spec.ts:234-237`). Isso leva um tipo de transporte para o teste do componente, que pela régua não deveria saber de HTTP. Um `new Error('qualquer')` prova a mesma regra da D1b sem esse acoplamento. O teste de que o 500 continua como `HttpErrorResponse` já existe no nível do service.

## Observações fora do escopo deste diff

- **ID23 da `architecture.md`:** o texto diz que o `errorInterceptor` "centraliza toast + log + retry policy". O interceptor ainda não existe. Quando ele for criado, a equipe precisa decidir se a tradução do status 0 continua no service (opção D1 = C, que sobrevive à troca para Supabase) ou passa para o interceptor. Vale registrar essa decisão na `architecture.md` para não haver duas fontes de verdade.
- O status 0 também acontece em erro de CORS. Nesse caso, a mensagem "Verifique sua conexão" engana o usuário. É raro com json-server, que libera CORS por padrão, mas vale lembrar na migração.
- O item E (estado "enviando" e proteção contra duplo clique) já está registrado pela equipe como futura Issue de manutenção. Não tratei isso como apontamento.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\login\login.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\login\login.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\login\login.spec.ts

Não gravei este parecer. Pela regra 7, o fluxo deve gravá-lo em `c:\Users\Gabriel\Desktop\munte_app\specs\8-us12-autenticacao-email-institucional\reviews\tarefa-06-codigo-r1.md`.
