# Parecer de Código: Tarefa 5

**Veredito:** APROVADO

O que verifiquei: li `docs/architecture.md` inteiro e o diff inteiro (`git diff 9c1c4db -- apps`), e conferi os arquivos completos depois da mudança. Rodei os testes e o lint pelo PowerShell com o drive em maiúsculo: 14 arquivos de teste e 83 testes passaram, e o `eslint .` terminou sem nenhum aviso. Procurei no repositório algum validador de data ou `maxLength` que já existisse. O único lugar parecido é a comparação com `Date.now()` em `core/services/auth.service.ts:80`, que trata da validade do link de confirmação, uma regra diferente. Por isso a regra não está duplicada.

## Apontamentos (bloqueiam)
Nenhum.

Itens conferidos contra a régua:
- **Camada (Data Layer Rule, seção 1):** o diff não acessa o servidor. O validador é uma função pura do Angular Forms, fica em `features/driver/ride-offer-form/` (como o plano prevê) e importa apenas `@angular/forms`. A regra de dependência da seção 4 continua respeitada.
- **Sintaxe (seção 1 e IDs 6, 7 e 24):** usa `@if` e `@for ... track erro.key`, sem `*ngIf`. As mensagens saem de `control.errors | keyvalue` e só aparecem com `invalid && touched`, que é o padrão do ID24 e o mesmo dos outros campos. Não aparece injeção por construtor nem estado novo fora de signal.
- **Segredo ou URL de ambiente:** não há.
- **Erro engolido:** não há. Quando o campo está vazio, o validador devolve `null` de propósito, porque esse caso é do `Validators.required`. O comentário explica isso e um teste cobre.
- **Abstração para um caso só:** o `horarioFuturo` como `ValidatorFn` separado é o jeito normal de fazer isso no Angular. Ele também traz um ganho concreto: dá para testá-lo isolado com o relógio simulado (`vi.setSystemTime`). Não é uma camada a mais sem motivo.
- **Testes presos à implementação:** os testes do componente olham o que o usuário vê e o que a acessibilidade expõe: o texto da mensagem, `role="alert"`, `aria-invalid` e o botão desligado. Não olham a chave do erro nem o estado interno do `FormGroup`. O teste do componente usa o relógio real com uma folga de ±1 dia (`horarioLocal(±UM_DIA)`), então não depende de minuto exato. O teste de fronteira (exatamente agora contra +1 minuto) ficou no teste do validador, com o relógio parado, que é onde deve ficar.

## Sugestões (não bloqueiam)
- **O limite 200 aparece duas vezes:** em `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.ts:35` (`Validators.maxLength(200)`) e no texto `'máximo 200 caracteres'` em `ride-offer-form.ts:54`. Se o limite mudar só em um dos lugares, a mensagem passa a mentir e nenhum teste do validador percebe. O teste do componente perceberia apenas se usasse o novo número. Uma constante (`LIMITE_OBSERVACOES = 200`) usada nos dois pontos resolveria. Os limites de vagas da Tarefa 4 (1 e 4 em `ride-offer-form.ts:32-33` e `:51-52`) seguem o mesmo padrão, então isso é sugestão e não apontamento.
- **Sobre `const valor: string = control.value;` em `apps/web/src/app/features/driver/ride-offer-form/horario-futuro.validator.ts:6`:** a anotação afirma um tipo que o compilador não confere, porque `control.value` é `any`. Um texto que não seja data (`new Date('xyz')` gera `NaN`) acaba como `{ horarioFuturo: true }`, o que é aceitável aqui, já que o `datetime-local` só produz texto bem formado. Vale saber que esse caminho existe e que não tem teste. É só uma observação, não exige mudança.

## Observações fora do escopo deste diff
- **Bloco de mensagem de erro repetido:** `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.html` agora tem 6 cópias quase iguais do bloco `@if (x.invalid && x.touched) { <p id="x-erro" role="alert"> @for ... }` e dos `[attr.aria-invalid]`/`[attr.aria-describedby]`. O diff só seguiu o padrão das tarefas 2 a 4, mas esse padrão pode virar um componente em `shared/components/` (a arquitetura cita "Input" ali) quando outro formulário precisar dele. Pode ser uma Issue de manutenção.
- **Botão "Publicar" diferente do ID24:** o ID24 de `docs/architecture.md` descreve o botão como `[disabled]="form.invalid | form.pristine"`, mas o template usa só `form.invalid` (`ride-offer-form.html:152`). Isso vem de antes desta tarefa e parece estar de acordo com o CA9 da spec. Se for intencional, quem decide é o usuário, e talvez valha alinhar o texto do ADR.
- **Horário que vira passado com a tela aberta:** não foi incluído no julgamento, como o usuário decidiu antes da implementação.

Arquivos revisados:
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\horario-futuro.validator.ts`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\horario-futuro.validator.spec.ts`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html`
- `c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts`

Não gravei nenhum arquivo. Gravar este parecer em `specs/3-us01-motorista-cadastra-oferta/reviews/tarefa-05-codigo-r<rodada>.md` fica a cargo do fluxo.
