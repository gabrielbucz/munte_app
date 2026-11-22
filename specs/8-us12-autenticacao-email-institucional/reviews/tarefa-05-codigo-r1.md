# Parecer de Código — Tarefa 5

**Veredito:** APROVADO

Não encontrei nada que bloqueie. Na raiz do repositório, `npm test` passou com 28 de 28 testes em 7 arquivos, e `npm run lint` não acusou nenhum erro. Diff revisado: `git diff 1fa55f6e0d3b0c3f8b38e1220a10fdc39b5a15d3`, que abrange `login.ts`, `login.html` e `login.spec.ts` em `C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\auth\login\`.

O diff contra o `docs/architecture.md`:
- **Camada (Data Layer Rule, seção 1; regra imutável da seção 8):** o componente continua falando com o servidor só pelo `AuthService`. A classe `EmailNaoPermitidoError` vem de `core/services` (features → core é permitido pela seção 4). A troca para o Supabase continua restrita ao Service, desde que ele siga lançando a mesma classe de erro.
- **Sintaxe:** usa `@if` (ID6), `inject()` (ID15), estado em `signal()` (ID10) e Reactive Forms. Não há `standalone: true`, `any` nem `*ngIf`.
- **Estilo (ID5):** `text-perigo` é um token de `docs/design-tokens.md` (linha 33, "erros"). Não há hexadecimal nem `style=`.
- **Erro engolido:** não há. Com `EmailNaoPermitidoError` a tela mostra a mensagem. Qualquer outro erro vai para `ErrorHandler.handleError` (`login.ts:36`), conforme a decisão 1 da equipe, e um teste confere isso (`login.spec.ts:170-180`).
- **Segredo ou URL de ambiente:** não há.
- **Duplicação:** a mensagem "e-mail não permitido ou link inválido" aparece no código só em `login.html:26`. Procurei em `apps/web/src`.
- **Testes:** testam o que o usuário percebe: `role="alert"`, texto, ausência do quadro e `aria-*`. O id do alerta não é fixado, só se confere que `aria-describedby` aponta para ele. Também conferi no `node_modules` (`@angular/core/fesm2022/testing.mjs:36-57`) se trocar o `ErrorHandler` por um mock esconde erros de renderização em outros testes. Não esconde: o `TestBedApplicationErrorHandler` chama o handler do usuário e depois relança o erro.
- As decisões 1, 2 e 3 da equipe estão implementadas como foram registradas. Não as tratei como desvio.

## Apontamentos (bloqueiam)
Nenhum.

## Sugestões (não bloqueiam)
- **O teste do erro de rede verifica mais do que o título diz** (`login.spec.ts:177`). O título é "não exibe a mensagem do CA3", mas a linha confere que não existe nenhum `[role="alert"]`. Na Tarefa 6, a mensagem de falha de rede provavelmente também será `role="alert"`, e o teste vai quebrar. O risco é alguém apagá-lo e perder a proteção que importa: falha de rede não pode mostrar o texto do CA3. Seria mais robusto conferir que nenhum alerta tem o texto `mensagemDeBloqueio`.
- **Dois signals tendem a criar estados impossíveis** (`login.ts:21-22`). A decisão 3 foi registrada e está bem aplicada, porque os dois signals são limpos no começo de cada envio. Mas a Tarefa 6 deve trazer `falhaDeRede` e provavelmente `enviando` (sugerido no parecer de código da Tarefa 3). Com quatro signals independentes, passa a ser possível, por exemplo, mostrar link e erro ao mesmo tempo. Vale considerar na Tarefa 6 um único signal com união discriminada (por exemplo `'ocioso' | 'link' | 'bloqueado' | 'falha'`). Não é pedido para agora.
- **O comentário vai ficar desatualizado** (`login.ts:35`). Ele cita "Tarefa 6", que é um número do plano e não uma Issue. Se a Tarefa 6 não removê-lo, ele vira ruído. Prefira apagá-lo lá ou trocar por uma referência a Issue, como os `TODO #25`.
- **O id do alerta é fixo** (`login.html:18` e `25`). Hoje é seguro. Na Tarefa 6, se a mensagem de rede também ligar `aria-describedby`, use outro id ou um id calculado, para não haver dois `email-erro` no DOM.
- **Erro repetido não é anunciado de novo:** dois envios seguidos com e-mail bloqueado fazem `false → true` no mesmo tick, então o `<p role="alert">` não é recriado e o leitor de tela pode não repetir o aviso. O efeito é pequeno, mais de acessibilidade que de arquitetura.
- **Helper ainda sem uso no teste antigo** (`login.spec.ts:83-86`). O teste de CA1 repete os passos do novo helper `submeter` (linhas 54-63) e poderia usá-lo. É só legibilidade.
- **Texto do CA3 em vários lugares no futuro:** quando o `auth-callback` (Tarefas 7 e 10, CA4) também usar "e-mail não permitido ou link inválido", vale centralizar a mensagem. Hoje há um uso só, e criar uma constante agora seria abstração para um caso único.

## Observações fora do escopo deste diff
- `login.spec.ts:13` (existia antes): `solicitarLink` tem o tipo `ReturnType<typeof vi.fn>`, sem a assinatura de `AuthService['solicitarLink']`. Uma mudança no contrato do Service não quebraria a compilação do teste. Pode virar Issue de manutenção, junto com o mesmo padrão em outros specs, se houver.
- O botão continua habilitado durante o `POST`, então um duplo clique grava dois `magicLinks`. Isso já foi apontado no parecer de código da Tarefa 3 e encaminhado para a Tarefa 6. Registro aqui só para que seja conferido lá.
