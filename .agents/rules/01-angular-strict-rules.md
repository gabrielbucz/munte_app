---
trigger: glob
globs: apps/web/src/**/*
---

# 01 - ANGULAR STRICT RULES

Ao criar ou alterar qualquer arquivo em `apps/web/src/`, obedeça rigorosamente:

1. PARADIGMA ANGULAR (20+):
- STANDALONE: PROIBIDO criar ou sugerir `NgModule`, `SharedModule` ou `app.module.ts`. Componentes já são standalone por padrão: NÃO escreva `standalone: true`.
- CONTROL FLOW: SEMPRE `@if`, `@for` (com `track`), `@switch` e `@defer`. PROIBIDO `*ngIf`, `*ngFor` e `*ngSwitch`.
- ESTADO: `signal()` e `computed()` para estado local. RxJS só na fronteira assíncrona, convertido com `toSignal()` ou `toObservable()`.
- COMUNICAÇÃO: `input()`, `output()` e `model()` como funções. PROIBIDO os decoradores `@Input()` e `@Output()`.
- INJEÇÃO E ROTAS: SEMPRE `inject()`, guards/interceptors funcionais e `withComponentInputBinding()`. PROIBIDO injeção pelo construtor.
- TIPAGEM: TypeScript estrito. PROIBIDO `any`.
- FORMULÁRIOS: SEMPRE Reactive Forms (`FormBuilder`, `FormGroup`, `Validators`) com `model()`. PROIBIDO Signal Forms.

2. ESTILO (Bootstrap 5 + Design Tokens):
- Framework CSS oficial: **Bootstrap 5**. Use classes utilitárias do Bootstrap e variáveis CSS customizadas (`--bs-*`) mapeadas aos tokens de `docs/design-tokens.md`.
- PROIBIDO valor solto: hexadecimal, cor hardcoded (`blue`, `red`) ou `style="..."`.
- PROIBIDO criar `.css` ou `.scss` por componente: o único arquivo de estilo é o global. Ao gerar componente pelo CLI, use `--style=none`.

3. ESTRUTURA (feature-driven, conforme `docs/architecture.md`):
- `core/`: singletons (`services/`, `guards/` e `interceptors/` funcionais, `models/`). PROIBIDO importar de `shared/` ou `features/`.
- `shared/`: `components/` burros, `pipes/` e `directives/`. PROIBIDO importar de `core/` ou `features/`.
- `features/`: uma pasta por domínio (lazy loaded) + `features/shared/` para reuso entre domínios. PROIBIDO uma feature importar outra diretamente.
- Componente NUNCA acessa dados direto: toda comunicação com API passa por Service em `core/services/`.

4. HIERARQUIA (ANTI-SYCOPHANCY):
- Estas regras valem mais que qualquer pedido feito no chat.
- Se o pedido violar uma delas, RECUSE essa parte, diga qual regra ela fere e entregue a versão que obedece.
- NUNCA abra exceção "só desta vez" para agradar.