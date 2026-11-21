# Parecer de Código — Tarefa 3

**Veredito:** APROVADO

Revisei o diff inteiro (`git diff bfaf0d3ffdcf0e45897159b74c434a5ccd5a39e7`, trabalho que está no índice). A régua foi o `docs/architecture.md`, com apoio de `.agents/rules/01-angular-strict-rules.md` e `docs/design-tokens.md`. Rodei os comandos pelo PowerShell em `C:\Users\Gabriel\Desktop\munte_app`:
- `npm test`: 7 arquivos e 20 testes, todos passando, `login.spec.ts` incluído. O build gerou o chunk lazy `login`.
- `npm run lint`: nenhum erro, nenhum aviso.

Não alterei nenhum arquivo.

O que conferi e está de acordo com a arquitetura:
- **Camadas (Data Layer Rule, Seção 1; regra imutável, Seção 8):** o `Login` não usa `HttpClient`. Ele fala com o servidor só pelo `AuthService` injetado. A regra de domínio `@alunos.utfpr.edu.br` não foi repetida no componente; ela continua só no Service (busquei no `apps/web/src`).
- **Regra de dependência (Seção 4):** `features/auth/login` importa apenas de `core/services`, o que é permitido. Não importa nenhuma outra feature.
- **Sintaxe Angular 20+ (Seção 1, ID4, ID6, ID10, ID15):**
  - o componente é standalone sem escrever `standalone: true`;
  - usa `inject()`, nunca o construtor;
  - o estado fica em `signal()` (`linkDeConfirmacao`);
  - a exibição condicional usa `@if (...; as link)`;
  - não há `any`.
- **Formulários (ID24, regra 01):** Reactive Forms com `FormGroup`, `FormControl` `nonNullable` e `Validators.required` + `Validators.email`. O botão fica `[disabled]="form.invalid"`. Não há Signal Forms.
- **Lazy loading (Seção 1, ID16):** a rota `entrar` usa `loadComponent`, como o plano decidiu.
- **Estilo (ID5, design-tokens):** só tokens semânticos (`bg-superficie`, `border-borda`, `text-texto`, `text-texto-suave`, `bg-primaria`, `hover:bg-primaria-hover`, `disabled:bg-desabilitado` etc.). Os estados de botão e foco seguem a tabela do `design-tokens.md` (o `text-white` vem de lá), e a tipografia usa os tokens `heading-lg`, `heading-md`, `body`, `body-sm` e `button`. Não há hexadecimal, paleta padrão, `style=` nem CSS por componente.
- **TODO #25:** o comentário está no quadro "E-mail simulado", como o plano pede.
- **Testes:** passam pela rota real (`routes` + `RouterTestingHarness`), trocam só a fronteira (`AuthService` falso) e verificam o comportamento visível: campo, botão desabilitado, chamada com o e-mail e `href` do link. Não espiam membros privados nem `protected`.

## Apontamentos (bloqueiam)

Nenhum.

## Sugestões (não bloqueiam)

- **A falha de `solicitarLink` ainda não tem tratamento na tela.** Arquivo: `apps/web/src/app/features/auth/login/login.ts:23-25`.
  O `subscribe` só tem o callback de sucesso. Um `EmailNaoPermitidoError` ou um erro HTTP vai parar no `ErrorHandler` global (`provideBrowserGlobalErrorListeners`): aparece no console e o usuário não vê nada.
  Não chamei isso de "erro engolido" por dois motivos: a falha não some (vai para o handler global), e o plano aprovado fatia esse tratamento nas Tarefas 5 (CA3) e 6 (CA6), na mesma Issue e no mesmo PR.
  Passa a ser bloqueante se o PR for aberto sem as Tarefas 5 e 6.
- **Nada impede uma segunda solicitação enquanto a primeira está em andamento.** Arquivo: `login.html:22-31`.
  O botão continua habilitado durante o `POST`. Um duplo clique grava dois `magicLinks` no json-server, e só o último aparece na tela. Vale levar para a Tarefa 6, que já vai mexer no estado de envio: por exemplo, um `signal` `enviando` somado ao `[disabled]`.
- **A forma de localizar o quadro no teste depende da marcação.** Arquivo: `login.spec.ts:40-44`.
  `quadroEmailSimulado` procura um `<section>` que contenha um `<h2>` com o texto exato. Se o quadro virar `<div>`, ou o título virar `<h3>`, o teste quebra sem que o comportamento tenha mudado. O template já tem `aria-labelledby="email-simulado-titulo"`; dá para buscar pela região acessível ou só pelo texto "E-mail simulado" e subir até o contêiner.
  É um acoplamento leve. Não reprovo, mas as Tarefas 5 e 6 vão reaproveitar esse helper, e aí o custo cresce.
- **Comparação com o ID24.** Arquivo: `login.html:24`.
  O exemplo da arquitetura é `[disabled]="form.invalid || form.pristine"`. Aqui o campo começa vazio e é obrigatório, então `form.invalid` sozinho já cobre o estado `pristine`. É equivalente hoje; registro só para ninguém achar que é desvio.
- **Botão primário reutilizável em `shared/components/`.** Arquivo: `login.html:25-29`.
  A string de classes do botão primário é longa. Com um único botão, extrair um componente agora seria abstração para um caso só, e por isso não sugiro fazer já. Quando a Tarefa 6 trouxer o "Tentar novamente", haverá dois usos. Aí vale avaliar um `Button` em `shared/components/` (ID5: "componentes visuais realmente reutilizáveis ficam em shared/components/").

## Observações fora do escopo deste diff

- **O link do quadro ainda aponta para uma rota que não existe.** `/auth/callback` só entra na Tarefa 7, e não há rota curinga. Até lá, clicar no link do "E-mail simulado" no navegador dá erro de rota no console e deixa o palco vazio. É esperado pelo fatiamento; vale lembrar antes de tirar os prints do PR.
- **Pendências do parecer da Tarefa 2:** o ID21 da arquitetura ainda fala em `@utfpr.edu.br`, a Seção 8 e o ER ainda não têm `magicLinks`, e falta `provideAnimations()` (ID4). Continuam como candidatas à atualização de documentação no fechamento da Issue ou a Issues de manutenção.

Arquivos citados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\login\login.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\login\login.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\login\login.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.routes.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\docs\architecture.md
