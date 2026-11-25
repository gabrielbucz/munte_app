# Parecer de Código — Tarefa 2

**Veredito:** APROVADO

Revisei com `git diff f084a212b74472b541134fc07e285913990dc472 -- apps`, que mostra 3 arquivos, todos no índice:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts

Rodei os testes e o lint pelo PowerShell (`C:` maiúsculo): `npm test` passou (13 arquivos, 68 testes) e `npm run lint` terminou sem erro nem aviso.

Conferi o diff contra o architecture.md:
- **Camada:** o componente continua sem falar com o servidor. Os pontos vêm de um `computed()` sobre o signal `neighborhoods`, que já existia e vem do `NeighborhoodService`. O diff não importa nada novo de `core/` nem de `shared/`.
- **Sintaxe (Seção 1, ID6, ID7, ID10, ID24):** usa `@if` e `@for` com `track`, `computed()` e `inject()`. Os validadores (`Validators`) são declarados no próprio controle. A mensagem só aparece com `control.invalid && control.touched` e percorre `errors | keyvalue`, como o exemplo do ID24 manda. O botão tem `[disabled]="form.invalid"`.
- **Segredo ou URL:** nenhum.
- **Tratamento de erro:** o diff não tem caminho de erro.
- **Duplicação no repo:** procurei "preenchimento obrigatório", `mensagensDeErro`/`errorMessages` e `Validators.required`. Fora deste formulário, só existe o `Validators.required` do login, que não exibe mensagem de obrigatório. Não há regra duplicada.
- **Pontos provisórios:** o `pickupPoints` lista os pontos de todos os bairros, conforme a decisão do usuário registrada, e está marcado com `// TODO #3` (ride-offer-form.ts:18).

## Apontamentos (bloqueiam)
Nenhum.

## Sugestões (não bloqueiam)
- **O teste do caso "Bairro" vai quebrar na Tarefa 3** (ride-offer-form.spec.ts:185 e :238). No `it.each` "com X vazio e o resto preenchido", o caso `'Bairro'` escolhe o ponto "Praça central" sem bairro escolhido. Isso só funciona porque hoje o select lista todos os pontos. Quando a Tarefa 3 filtrar por bairro, o select de ponto ficará sem opções e o `expect(opcao).toBeTruthy()` dentro de `escolher` vai falhar. Não reprovo porque essa dependência vem da decisão do usuário. Mas a Tarefa 3 terá de reescrever esse caso, por exemplo deixando bairro e ponto vazios, ou preenchendo tudo e depois limpando o bairro. Convém registrar isso para que a mudança não pareça enfraquecimento de teste.
- **Chave de erro sem mensagem gera alerta vazio** (ride-offer-form.ts:35 e `{{ mensagensDeErro[erro.key] }}` nas linhas 28, 54, 80, 102 e 122 do html). Como o tipo é `Record<string, string>`, uma chave que não esteja no mapa (`min`, `max`, `maxLength`, `horarioFuturo` nas Tarefas 4 e 5) mostra um `<p role="alert">` vazio, sem erro de compilação nem de lint. Os testes das Tarefas 4 e 5 devem pegar isso, mas tipar as chaves, ou ter uma mensagem padrão, torna o esquecimento visível.
- **Várias mensagens saem coladas** (mesmas linhas do html). O `@for` imprime todas as mensagens de um campo no mesmo `<p>`, sem separador. Hoje cada campo tem no máximo um erro por vez. Se algum campo passar a ter dois ao mesmo tempo, o texto sai grudado.
- **O mesmo bloco se repete cinco vezes no template:** `aria-invalid`, `aria-describedby`, `@if` e `@for`, com a condição `x.invalid && x.touched` escrita três vezes por campo. Não proponho extrair agora, porque seria uma abstração para um formulário só. Se outro formulário (veículo, solicitação) repetir o padrão, vale um componente de mensagem em `shared/components/`.
- **Estilo diferente em `seats`** (ride-offer-form.ts:31). É o único controle que passa o validador como segundo argumento; os outros usam o objeto `{ validators }`. É só estilo.
- **Helpers de teste repetidos.** `abrirFormulario` e `fieldsetSentido` repetem o que o primeiro `describe` faz à mão (linhas 70–82). Subir os helpers para o nível do arquivo evita duas versões do mesmo localizador. Isso exige mexer no bloco antigo, então fica para quando for conveniente.

## Observações fora do escopo deste diff
- Nenhuma nova. O `seats` aceita `null`, apesar de o plano falar em `FormGroup` com `nonNullable`, mas isso vem da Tarefa 1 e o diff só acrescentou o validador.
