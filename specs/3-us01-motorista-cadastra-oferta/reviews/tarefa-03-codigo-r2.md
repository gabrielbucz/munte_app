# Parecer de Código: Tarefa 3 (rodada 2)

**Veredito:** APROVADO

Testes e lint rodados pelo PowerShell com `C:` maiúsculo: o `npm test` passou 71 testes em 13 arquivos, sem falha. O `npm run lint` (`eslint .`) terminou sem erro nem aviso.

Escopo: `git diff 83d4f04..índice -- apps`, que mexe só em `ride-offer-form.ts` e `ride-offer-form.spec.ts`. O `ride-offer-form.ts` não mudou desde a r1: são o `toSignal(valueChanges)`, o `computed` com `find` e a assinatura com `takeUntilDestroyed()` + `reset('')` no construtor. O que mudou na r2 foi o teste "trocar de bairro desmarca o ponto", por causa do apontamento 1 aceito em `tarefa-03-decisoes-r1.md`. O `.html` não mudou: o `@for (pickupPoint of pickupPoints(); track pickupPoint.id)` agora lê o `computed` filtrado.

## Apontamentos (bloqueiam)
Nenhum.

O que conferi contra `docs/architecture.md`:
- **Data Layer Rule (Seção 1) e regra de dependência (Seção 4):** o componente não fala com o servidor. Os bairros vêm de `NeighborhoodService.listar()` via `inject()`, e o filtro por bairro só decide o que aparece na tela. O import continua sendo `features → core`.
- **Signals, ID10 e ID25:** o bairro escolhido vira signal com `toSignal(valueChanges, { initialValue })`, e `pickupPoints` é um `computed()`. O TODO provisório que listava os pontos de todos os bairros foi removido.
- **"inject() (não injeção via construtor)":** não é violado. O `constructor()` em `ride-offer-form.ts:45-49` não recebe nenhuma dependência. Ele existe só porque `takeUntilDestroyed()` precisa rodar num contexto de injeção.
- **ID13 (`effect()`):** a limpeza usa `valueChanges` em vez de `effect()` por decisão do usuário, e o ID13 dá `effect()` como exemplo, não como obrigação. A assinatura é encerrada com `takeUntilDestroyed()`, então não vaza.
- **Erros, segredos, URLs e abstrações:** não há tratamento de erro novo, nenhum segredo ou URL, nem abstração usada num caso só.
- **Duplicação:** procurei os auxiliares do teste (`campoPorRotulo`, `abrirFormulario`, `sair`, `escolher`, `digitar`, `horarioNoFuturo`) em `apps/web/src`. Cada um existe só neste spec. Subi-los do `describe` para o topo do arquivo só mudou o lugar, não a lógica.
- **Teste acoplado a detalhe de implementação:** não está. O teste corrigido (`ride-offer-form.spec.ts`, último `describe`, caso "trocar de bairro desmarca...") prova o desmarque pelo botão "Publicar":
  - com tudo válido, ele fica ligado;
  - depois da troca de bairro, ele fica desligado.

  Se o `reset('')` fosse tirado, o controle continuaria valendo `'1'` e o botão continuaria ligado, então o teste ficaria vermelho. Ele não depende de nenhum campo interno do componente.

  O `sair(harness, ponto)` antes da troca marca o ponto como tocado. Por isso as verificações de `aria-invalid` nulo, ausência de `aria-describedby` e ausência de `role="alert"` provam que o `reset` também volta o ponto a não tocado, que é o que o CA9 pede.

  O comentário sobre o `<select>` aparecer vazio mesmo sem limpar o formulário explica por que `ponto.value` sozinho não basta. Isso ajuda quem mexer no teste depois.

## Sugestões (não bloqueiam)
São as duas da r1, que continuam valendo porque o `.ts` não mudou:
- **Ordem ao preencher o formulário por código** (`ride-offer-form.ts:46-48`). Se uma tarefa futura usar `form.setValue`/`patchValue` (por exemplo, para editar ou reabrir uma oferta), o bairro precisa ser gravado antes do ponto. Se não for, o ponto é apagado logo depois de gravado. Quando chegar a hora, vale um comentário avisando disso ou `{ emitEvent: false }`. Hoje nada preenche o formulário por código, então não há prejuízo.
- **Duas assinaturas no mesmo `neighborhoodId.valueChanges`** (linhas 30-33 e 46-48). Hoje funciona, mas são dois lugares reagindo à troca de bairro, e quem mexer depois precisa saber disso.

## Observações fora do escopo deste diff
- **Ordem dos pontos:** `pickupPoints` lista os pontos na ordem do `db.json`, e não pelo campo `order` do `PickupPoint` (glossário, Seção 5). O CA10 não exige ordem e isso já era assim antes desta tarefa. Pode virar uma Issue de manutenção para ordenar no `NeighborhoodService`.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html (não mudou, só li para conferir o `@for` e o `[disabled]="form.invalid"`)
- c:\Users\Gabriel\Desktop\munte_app\docs\architecture.md
- c:\Users\Gabriel\Desktop\munte_app\specs\3-us01-motorista-cadastra-oferta\reviews\tarefa-03-codigo-r1.md, tarefa-03-conformidade-r1.md e tarefa-03-decisoes-r1.md (para saber o que mudou na r1)

Não alterei nenhum arquivo. Usei o Bash só para o `git diff` e para rodar os testes e o lint. Gravar este parecer em `specs/3-us01-motorista-cadastra-oferta/reviews/tarefa-03-codigo-r2.md` fica com o fluxo que me chamou.
