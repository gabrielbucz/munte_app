# Parecer de Código: Tarefa 1

**Veredito:** APROVADO

Não há apontamento bloqueante. Há uma sugestão importante (a primeira abaixo): é um defeito visual real, mas não está em nenhuma das categorias que reprovam.

**Escopo julgado:** `git diff c0c2f0b69f7aa1da89381825bdf043e0c26f4bf4`, que só tem trabalho no índice. Os arquivos são `app.css` (removido), `app.html`, `app.spec.ts`, `app.ts`, `shared/components/header/header.{ts,html,spec.ts}` e `shared/components/footer/footer.{ts,html,spec.ts}`. Batem exatamente com os "Arquivos previstos" da Tarefa 1. O `footer.spec.ts` é um arquivo de teste a mais, mas já estava no plano.

**Verificações:**
- `npm run lint`: passou sem nenhum aviso.
- `npm test`: 5 arquivos de teste e 10 testes, todos passando.
  - Rodando pelo Git Bash (caminho com `c:` minúsculo), as 5 suítes falham com "Vitest failed to find the runner". Isso inclui as suítes antigas que o diff não tocou (`calculadora.service.spec.ts`, `testbed-check.spec.ts`).
  - Rodando por `cmd /c "cd /d C:\Users\Gabriel\Desktop\munte_app && npm test"` (caminho com `C:` maiúsculo), tudo passa. É uma questão do ambiente, não do diff (ver observações).

**Conformidade com a arquitetura (sem violação):**
- Seção 1 e ID4: os componentes são standalone e nenhum declara `standalone: true`. Não há `NgModule`.
- ID6 e ID7: o template usa `@for (link of links; track link.caminho)`. Não há `*ngFor` nem `*ngIf`.
- Seção 4, regra de dependência: `Header` e `Footer` ficam em `shared/components/` e não importam nada de `core/` nem de `features/`. O único import externo é `@angular/router`, que é permitido.
- ID5 e regra 01, item 2: `app.css` foi removido e nenhum componente tem CSS próprio. Só são usados tokens do `design-tokens.md` (`bg-background`, `text-texto`, `bg-superficie`, `border-borda`, `text-texto-suave`, `text-primaria`, `hover:text-primaria-hover`, `ring-primaria/25`) e espaçamentos da escala (`p-4`, `p-8`, `px-4`, `py-3`, `gap-4`). Não há hexadecimal, cor da paleta padrão nem `style=`.
- Data Layer Rule: nenhum componente acessa dados. Não há segredo nem URL de ambiente no código.
- ID18: a casca tem um `<router-outlet>` pai dentro do `<main>`, pronto para as rotas lazy das próximas tarefas.

## Apontamentos (bloqueiam)
Nenhum.

## Sugestões (não bloqueiam)
- **`routerLinkActive="text-primaria"` não tem efeito visível.** Fica em `apps/web/src/app/shared/components/header/header.html:11-12`.
  - O mesmo `<a>` já tem `text-texto-suave` fixo. Os dois utilitários definem `color` e têm a mesma especificidade, então vale o que vem por último no CSS gerado, não a ordem no atributo `class`.
  - Conferi compilando o `styles.css` real com `@tailwindcss/node`, com saída só no terminal. O Tailwind v4 emite `.text-primaria` antes de `.text-texto-suave`, então o cinza sempre ganha.
  - Na prática, o link ativo ("Entrar" quando o usuário estiver em `/entrar`) nunca fica azul. É código que promete um comportamento que não acontece.
  - Saídas possíveis: tirar o `routerLinkActive` (ele não está na spec nem no plano), ou trocar a cor de forma que não conflite. Isso merece decisão antes da Tarefa 4, que vai reaproveitar a mesma lista na gaveta.
- **O `Header` conhece as rotas da aplicação.** Fica em `apps/web/src/app/shared/components/header/header.ts:15`.
  - A lista `links` está escrita dentro de um componente de `shared/`, que a seção 4 define como "burro". Isso segue o plano aprovado, então não é apontamento.
  - O prejuízo previsível: quando a navegação depender da sessão (por exemplo, "Início" e "Sair" depois do login, na US13), o `Header` não poderá injetar o `AuthService`, porque `shared` não importa `core`. A lista terá de virar `input()` vindo do `App`. Vale registrar isso como decisão consciente.
- **`links` é um array comum, não um signal.** Fica em `header.ts:15`.
  - Está correto hoje, porque é uma constante e não estado, então o ID10 não se aplica. Se a lista passar a variar, por exemplo com a sessão, ela deve virar `computed()` ou `input()`.
- **Teste preso à estrutura exata da raiz.** Fica em `apps/web/src/app/app.spec.ts:28`.
  - `expect(filhos).toEqual(['app-header', 'main', 'app-footer'])` exige que a raiz tenha exatamente esses três filhos. Ele expressa bem a ordem do CA7.
  - O custo: qualquer elemento novo na raiz quebra o teste mesmo com o CA7 intacto, como um container de toast (o ID23 prevê toast no `errorInterceptor`) ou um link "pular para o conteúdo". Uma alternativa mais estável é conferir a ordem relativa dos três elementos.
- **O link da marca não tem foco visível.** Fica em `header.html:3`.
  - O link "Munte-app" não tem as classes `focus-visible:` que os links da navegação têm. É só consistência de acessibilidade com o padrão de foco do `design-tokens.md`.

## Observações fora do escopo deste diff
Nenhuma depende desta tarefa. São candidatas a Issue de manutenção:
- **`npm test` falha no Git Bash.** Quando o diretório atual vem com a letra do drive minúscula (`c:/Users/...`), todas as suítes falham com "Vitest failed to find the runner". Com `C:` maiúsculo (cmd ou PowerShell), passam. Vale documentar no README ou ajustar a configuração, para os revisores e a CI não verem um vermelho falso.
- **Pasta fora da estrutura da seção 4.** O arquivo `apps/web/src/app/utils/calculadora.service.ts` está numa pasta `utils/` que a arquitetura não prevê (services ficam em `core/services/`). Junto com ele há o `apps/web/src/app/testbed-check.spec.ts`, que parece ser um resto do setup.
- **Ferramenta de teste divergente da seção 3.** A seção 3 do `architecture.md` declara `@testing-library/angular`, mas o pacote não está no `apps/web/package.json` e os testes usam o `TestBed` puro. É preciso alinhar o documento ou a dependência.
- **`provideAnimations()` ausente.** O `apps/web/src/app/app.config.ts` não tem o `provideAnimations()` exigido pelo ID4. O `provideHttpClient()` também falta, mas o plano já o coloca na Tarefa 2 e não é problema deste diff.

**Arquivos relevantes:**
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\footer\footer.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\footer\footer.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\footer\footer.spec.ts
