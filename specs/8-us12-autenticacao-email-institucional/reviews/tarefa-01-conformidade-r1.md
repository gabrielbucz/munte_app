# Parecer de Conformidade — Tarefa 1

**Veredito:** APROVADO

O diff cumpre o CA7 sem apontamentos. As mudanças ficam dentro dos arquivos previstos no plano e não adiantam trabalho de outras tarefas.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA7: o conteúdo da tela da rota aparece no palco central, entre o cabeçalho e o rodapé da App Shell | atendido | `apps/web/src/app/app.html:1-5`; teste em `apps/web/src/app/app.spec.ts:20-34`, que confere os filhos exatos e em ordem (`['app-header','main','app-footer']`) e o componente da rota de teste dentro do `<main>` |
| CA7, decisão da equipe (desktop): a navegação fica na barra superior do cabeçalho | atendido | `apps/web/src/app/shared/components/header/header.html:5-19`, `header.ts:15` (lista única `links` com "Entrar" e `/entrar`); teste em `header.spec.ts:13-24`, que confere a âncora "Entrar" em `header nav` com `href="/entrar"` |
| CA7, decisão da equipe (mobile): os links saem da barra e vão para a gaveta aberta pelo ☰ | fora desta tarefa | A Tarefa 4 do plano (CA8/CA9) trata disso. A aparência mobile × desktop é conferida manualmente, segundo o "Fora de escopo" da spec |
| Rodapé da App Shell | atendido | `apps/web/src/app/shared/components/footer/footer.html:1-3`; teste em `footer.spec.ts:11-18` |
| Fora de escopo: "Links de navegação para as telas de outras histórias" | respeitado | Só existe o link "Entrar" (`header.ts:15`) |
| Não adiantar outras tarefas | respeitado | Nada de `menuAberto`, ☰, gaveta, `app.routes.ts`, `app.config.ts`, `AuthService` ou telas. Os 10 arquivos do diff são exatamente os previstos pela Tarefa 1, incluindo a remoção do `app.css` |
| Execução dos testes | atendido | Rodando `npm test` pelo PowerShell: 5 arquivos e 10 testes passam, entre eles os 3 novos do CA7 (App Shell, Header, Footer) |

## Apontamentos

(nenhum)

## Observações (não bloqueiam e não são apontamentos)
- **`npm test` falha pelo Git Bash, mas passa pelo PowerShell.** Pelo Git Bash (cwd `/c/Users/...`) os 5 arquivos falham com "Vitest failed to find the runner", inclusive `calculadora.service.spec.ts` e `testbed-check.spec.ts`, que o diff não toca. Pelo PowerShell (`C:\Users\...`) tudo passa. A causa parece ser o ambiente, provavelmente a letra do drive em minúscula (`c:/`) vinda do shell, e não esta tarefa. Pode valer uma Issue de manutenção ligada à #27.
- **O nome "Munte-app" no cabeçalho também é um link** (`routerLink="/"`, em `header.html:3`). O plano não cita esse link. Hoje a rota `''` não existe (o redirecionamento para `inicio` vem na Tarefa 7). Ele não leva à tela de outra história, então não viola o "Fora de escopo". Fica para sua triagem caso queira só o que o plano lista.
- **Rodada de TDD:** o diff não permite confirmar que o teste falhou antes de o código existir (RED). Fica com a evidência do implementador.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\footer\footer.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\footer\footer.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\footer\footer.spec.ts
