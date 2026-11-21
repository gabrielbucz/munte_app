# Parecer de Conformidade — Tarefa 4

**Veredito:** APROVADO

O diff cumpre CA8 e CA9 e as decisões da equipe registradas sob o CA7 e sob o CA8/CA9. Não encontrei apontamentos.

Diff revisado: `git diff 7da2fcac165779884e4e1a0edfa26adec64233cb`. São três arquivos, todos previstos na tarefa:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.spec.ts

Testes: rodei `npm test` na raiz. Passaram 7 arquivos de teste e 22 testes, inclusive os três do `Header` (CA7, CA8, CA9).

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA8: no mobile com a gaveta fechada, tocar no ☰ abre a gaveta e mostra o link da história | atendido | `header.html:22-32` (botão ☰ chama `alternarMenu()`, com `aria-expanded`); `header.html:35-57` (gaveta `@if (menuAberto())`); `header.ts` (`menuAberto = signal(false)`, `alternarMenu`); teste em `header.spec.ts`, it "CA8": a gaveta começa ausente e `aria-expanded="false"`, depois do clique a gaveta existe, `aria-expanded="true"` e o link "Entrar" leva a `href="/entrar"` |
| CA9: com a gaveta aberta, tocar no link fecha a gaveta e mostra a tela correspondente | atendido | `header.html:47` (`(click)="fecharMenu()"` junto com `[routerLink]`); `header.ts` (`fecharMenu`); teste em `header.spec.ts`, it "CA9": depois do clique em "Entrar" a gaveta some, `aria-expanded="false"` e `Router.url === '/entrar'`, com uma rota real `entrar` registrada no `provideRouter` |
| Decisão CA8/CA9: o link é "Entrar" e leva à tela de login | atendido | a gaveta usa a mesma lista `links` (`{ rotulo: 'Entrar', caminho: '/entrar' }`) da barra (`header.html:42`) |
| Decisão CA7: no desktop a navegação fica na barra superior; no mobile os links saem da barra e vão para a gaveta do ☰ | atendido (só nas classes) | `header.html:5` (`hidden md:block` na barra), `header.html:28` (`md:hidden` no ☰), `header.html:39` (`md:hidden` na gaveta). A aparência fica fora dos testes, como manda o "Fora de escopo" |
| CA7 (regressão): o link "Entrar" continua na barra superior | atendido | o teste "CA7" de `header.spec.ts` continua passando; com a gaveta fechada, o seletor `header nav a` só encontra a barra |
| Decisão da equipe: o link da gaveta reproduz o `<a>` da barra com `routerLinkActive` | atendido | `header.html:44-52`, igual a `header.html:9-16` mais o `(click)` |
| Fora de escopo: aparência mobile × desktop não é testada | respeitado | nenhum teste confere breakpoint nem classe CSS |
| Fora de escopo: links de outras histórias | respeitado | `links` continua com um único item ("Entrar") |
| Não adiantar outras tarefas (5 a 10) | respeitado | o diff não toca em login, AuthService, guard, callback, Início nem `app.routes.ts` |

## Apontamentos

(nenhum)

## Observações (não são apontamentos)
- O ☰ usa `alternarMenu()`, então um segundo toque também fecha a gaveta. A spec não pede isso de forma explícita, mas é o comportamento esperado de um botão com `aria-expanded`, e o plano já prevê o signal `menuAberto`. Não conto como escopo inflado.
- O teste do CA9 prova a navegação pela URL do roteador, não pela tela renderizada. Isso basta porque o `app.spec.ts` da Tarefa 1 já prova que a rota ativa aparece no palco central (`<main>` com `<router-outlet>`).
- O teste não simula a largura mobile. É coerente com o "Fora de escopo" (aparência conferida no navegador, com prints no PR), então a separação entre barra e gaveta por breakpoint precisa entrar nos prints do PR.
