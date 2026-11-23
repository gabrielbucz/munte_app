# Parecer de Código: Tarefa 3

**Veredito:** APROVADO

Não achei nada que bloqueie. Rodei o `npm test` pelo PowerShell com `C:` maiúsculo e passaram 71 testes em 13 arquivos. O `npm run lint` terminou sem erro nem aviso.

Escopo: diff `83d4f04..índice -- apps`. Ele mexe em dois arquivos, `ride-offer-form.ts` e `ride-offer-form.spec.ts`. O `ride-offer-form.html` está listado no plano, mas não mudou: o `@for (pickupPoint of pickupPoints(); track pickupPoint.id)` já existia e agora só lê um `computed` filtrado. Isso é coerente com o que a tarefa pede.

## Apontamentos (bloqueiam)
Nenhum.

Conferi item por item contra `docs/architecture.md`:
- **Camadas:** o componente continua sem falar com o servidor. Os bairros vêm de `NeighborhoodService.listar()` via `inject()`, e o filtro é só de exibição. Respeita a Data Layer Rule (Seção 1) e a regra de dependência `features → core` (Seção 4).
- **Signals (Seção 1, ID10, ID25):** o bairro escolhido vira signal por `toSignal(valueChanges, { initialValue })`, e `pickupPoints` é um `computed()`. O TODO provisório da Tarefa 2 que listava todos os pontos foi removido. A ponte RxJS para Signals é a que o ID25 prevê.
- **`constructor()` em `ride-offer-form.ts:45-49`:** não viola "inject() (não injeção via construtor)". O construtor não recebe nenhuma dependência, só abre a assinatura com `takeUntilDestroyed()`, que precisa de contexto de injeção.
- **Uso de valueChanges em vez de `effect()` (ID13):** o ID13 traz `effect()` como exemplo, não como proibição de outros meios. A escolha foi do usuário e está registrada. A assinatura é encerrada com `takeUntilDestroyed()`, então não vaza.
- **Erros, segredos, URLs e abstrações:** não há tratamento de erro novo, nenhum segredo ou URL e nenhuma abstração usada num caso só.
- **Duplicação:** procurei `pickupPoints`, `valueChanges` e `takeUntilDestroyed` em `apps/web/src`. Não existe outra regra de "pontos do bairro" no repositório.
- **Testes:** acham os campos pelo rótulo visível, escolhem a opção pelo texto e verificam `value`, `aria-invalid`, `aria-describedby` e `role="alert"`. Tudo isso é comportamento que o usuário vê ou que leitor de tela anuncia, não detalhe interno. Subir `abrirFormulario`, `mensagemDoCampo`, `sair` e `escolher` para o topo do arquivo, para o novo `describe` reaproveitar, foi só mudança de lugar, sem mudar a lógica. A reescrita do caso "Bairro vazio" virou um teste próprio, que verifica que Bairro e Ponto ficam vazios e que Publicar fica desligado. Isso deixa claro um estado que antes existia e agora não existe mais.

## Sugestões (não bloqueiam)
- **Ordem ao preencher o formulário inteiro de uma vez** (`ride-offer-form.ts:46-48`). A limpeza roda a cada valor novo de `neighborhoodId`, inclusive quando o código preenche os campos. Se uma tarefa futura usar `form.setValue({...})` ou `form.patchValue({...})` com `pickupPointId` vindo antes de `neighborhoodId` no objeto, o ponto é gravado e logo depois apagado. Hoje nada faz isso, então não há prejuízo. Vale um comentário curto avisando que o bairro tem que ser preenchido antes do ponto, ou passar `{ emitEvent: false }` quando chegar a hora.
- **Duas assinaturas no mesmo `valueChanges`** (linhas 30-33 e 46-48). Funciona e a ordem é segura, porque o `toSignal` é criado antes do construtor e o `reset` só dispara eventos do controle de ponto. Fica a nota de que existem dois pontos reagindo à troca de bairro, para quem mexer depois.

## Observações fora do escopo deste diff
- **Ordem dos pontos:** `pickupPoints` lista os pontos na ordem em que o json-server devolve (a do `db.json`), não pelo campo `order` do `PickupPoint` (Seção 5 do architecture.md). O CA10 não exige ordem, e isso já era assim antes da tarefa. Se a ordem importar na tela, pode virar uma Issue de manutenção para ordenar no `NeighborhoodService` (`apps/web/src/app/core/services/neighborhood.service.ts`), que é a camada certa para isso.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html (sem mudança, lido para conferir)
- c:\Users\Gabriel\Desktop\munte_app\docs\architecture.md

Não alterei nenhum arquivo. Usei o Bash só para o `git diff` e para rodar os testes e o lint. A gravação deste parecer em `specs/3-us01-motorista-cadastra-oferta/reviews/tarefa-03-codigo-r1.md` fica com o fluxo que me chamou.
