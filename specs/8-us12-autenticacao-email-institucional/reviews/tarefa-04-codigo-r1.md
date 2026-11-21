# Parecer de Código: Tarefa 4

**Veredito:** APROVADO

Nenhum apontamento bloqueia a tarefa. Deixo quatro sugestões e uma observação.

**Escopo julgado:** `git diff 7da2fcac165779884e4e1a0edfa26adec64233cb`, com o trabalho só no índice. O diff mexe em três arquivos, os mesmos previstos pela Tarefa 4:
- `apps/web/src/app/shared/components/header/header.ts`
- `apps/web/src/app/shared/components/header/header.html`
- `apps/web/src/app/shared/components/header/header.spec.ts`

**Verificações:**
- `npm test`, rodado via `cmd /c "cd /d C:\Users\Gabriel\Desktop\munte_app && npm test"`: 7 arquivos de teste e 22 testes, todos passando.
- `npm run lint`: sem nenhum erro ou aviso.

**Conformidade com a arquitetura (nenhuma violação):**
- **Seção 1, ID10 e ID11 (Signals):** o estado da gaveta é `menuAberto = signal(false)` (`header.ts:17`). Os handlers `alternarMenu()` e `fecharMenu()` mudam o signal com `update`/`set`, e não propriedades comuns da classe. O template lê `menuAberto()`.
- **ID6 e ID7 (Control Flow):** a gaveta usa `@if (menuAberto())` (`header.html:35`) e a lista usa `@for (link of links; track link.caminho)` (`header.html:42`). Não há `*ngIf` nem `*ngFor`.
- **ID4 e regra 01, item 1:** o componente continua standalone, sem `standalone: true` e sem `NgModule`. Não há injeção por construtor e não há `any`.
- **Seção 4 (regra de dependência):** o `Header` continua em `shared/` e só importa de `@angular/core` e `@angular/router`. Ele não importa `core/` nem `features/`. O estado novo é só de interface, sem acesso a dados, então a Data Layer Rule é respeitada.
- **ID5 e regra 01, item 2 (tokens):** só aparecem tokens do `design-tokens.md` e do `@theme` em `styles.css`: `text-texto`, `hover:text-primaria-hover`, `border-borda`, `text-texto-suave`, `text-primaria`, e o padrão de foco `focus-visible:ring-4 focus-visible:ring-primaria/25`. Os espaçamentos (`p-2`, `px-4`, `py-3`, `gap-3`) estão na escala. O corte em `md:` (768px) corresponde ao breakpoint registrado. Não há hexadecimal, cor da paleta padrão nem `style=`, e não foi criado CSS por componente.
- **Sem segredo nem URL de ambiente.** Não há tratamento de erro envolvido, e nenhuma abstração nova foi criada para um caso só.
- **Testes:** o CA9 confere a navegação de verdade por `TestBed.inject(Router).url` sobre uma rota de teste real (`TelaEntrarDeTeste`), sem mock do Router. Ele não depende do signal nem de método privado. Os helpers (`criarHeader`, `botaoMenu`, `gaveta`, `linkEntrarDaGaveta`) só reorganizam o que já existia, e o teste do CA7 continua válido.

## Apontamentos (bloqueiam)
Nenhum.

## Sugestões (não bloqueiam)
- **O ramo "☰ fecha a gaveta" não tem teste.** Fica em `header.ts:19-21`.
  - `alternarMenu()` faz `update((aberto) => !aberto)`, então tocar no ☰ de novo fecha a gaveta. Nenhum teste prova isso: o CA8 só cobre abrir e o CA9 fecha pelo link.
  - O comportamento é razoável e também não está em nenhum CA. Ainda assim, é lógica de produção sem teste, o que é uma brecha pequena no TDD.
  - Saídas: um teste de "abre e fecha pelo ☰", ou trocar por `set(true)` se fechar pelo ☰ não for desejado.
- **`aria-controls` aponta para um id que não existe quando a gaveta está fechada.** Fica em `header.html:25` junto com `header.html:35-38`.
  - Como a gaveta é criada e removida pelo `@if`, `aria-controls="gaveta-navegacao"` fica sem alvo no estado inicial. Leitores de tela costumam tolerar isso e o `aria-expanded` está correto.
  - O prejuízo é pequeno: validadores de acessibilidade (axe/Lighthouse) podem marcar como referência ARIA inválida.
  - Saídas: aplicar `aria-controls` só com a gaveta aberta (`[attr.aria-controls]="menuAberto() ? 'gaveta-navegacao' : null"`), ou manter o `<nav>` sempre no DOM e escondê-lo com `hidden`. A segunda exigiria ajustar os testes que esperam `null`.
- **A gaveta só fecha pelo próprio link ou pelo ☰.** Fica em `header.ts:23-25`.
  - Se a gaveta estiver aberta e o usuário navegar por outro caminho, ela continua aberta na tela nova. Exemplos: o link da marca "Munte-app" (`header.html:3`), o botão voltar do navegador, ou um redirecionamento futuro de guard.
  - Nenhum CA cobre isso hoje.
  - Se virar problema, dá para fechar ao receber o `NavigationEnd` do Router. Injetar o `Router` em `shared/` é permitido, porque `@angular/router` não é `core/`.
- **Os testes localizam elementos por id e por `aria-controls`.** Fica em `header.spec.ts:25` e `header.spec.ts:30`.
  - `button[aria-controls="gaveta-navegacao"]` e `#gaveta-navegacao` prendem os testes ao id escolhido, então renomear o id quebra os três testes de CA8/CA9 mesmo com o comportamento intacto.
  - O id faz parte do contrato de acessibilidade, por isso não reprovo. Buscar pelo nome acessível (`aria-label="Menu de navegação"`) seria mais estável.
- **A marcação do `<a>` está duplicada entre a barra e a gaveta** (`header.html:9-16` e `header.html:44-52`). Isso segue a decisão da equipe registrada antes da implementação, então não é apontamento. Fica só o lembrete: classes e atributos precisam ser mantidos iguais nos dois lugares à mão.

## Observações fora do escopo deste diff
- O `routerLinkActive="text-primaria"` continua sem efeito visível, já registrado na Tarefa 1. A gaveta herdou o mesmo comportamento, por decisão da equipe. Não conta como apontamento novo, só fica registrado que agora o padrão aparece em dois lugares.
- As observações de manutenção da Tarefa 1 continuam valendo, nenhuma causada por este diff:
  - `npm test` falha no Git Bash quando o caminho começa com `c:` minúsculo.
  - Há uma pasta `utils/` que a arquitetura não prevê.
  - `@testing-library/angular` está na seção 3 da arquitetura, mas não está instalado.
  - `provideAnimations()` está ausente.

Este revisor é somente leitura e não gravou este parecer. Ele deve ser salvo pelo fluxo em `c:\Users\Gabriel\Desktop\munte_app\specs\8-us12-autenticacao-email-institucional\reviews\tarefa-04-codigo-r1.md`.
