# Parecer de Código — Tarefa 10

**Veredito:** APONTAMENTOS

Conferi: `git diff aa45af6` lido inteiro (6 arquivos, todos previstos no plano). `npm test` deu 17 arquivos e 124 testes passando. `npm run lint` ficou limpo.

Contra o `docs/architecture.md`, o diff está em ordem:
- O guard é funcional (`CanDeactivateFn`), fica em `core/guards/` e está ligado em `app.routes.ts` por `canDeactivate`, como o ID19 pede.
- O componente usa `inject()`, guarda estado em `signal()` (`saidaLiberada`) e usa `@if` (Seção 1).
- A regra de dependência está respeitada: `features` importa `core`, e `core/guards` não importa `features` nem `shared` (Seção 4).
- Não há URL nem segredo escrito no código. Nenhum componente chama a API direto.

## Apontamentos (bloqueiam)

1. **Um descarte confirmado durante o envio não descarta nada: a oferta é gravada e o usuário é levado de `/inicio` para os detalhes dela.** Arquivos: `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.html:170-172` (o botão "Cancelar", sem `[disabled]`) e `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.ts:88-98` e `:119-124`.
   O que a evidência mostra: durante o envio (`enviando()` ligado), o "Publicar" desliga, mas o "Cancelar" novo continua ativo. Nesse momento `podeSair()` dá `pristine (false) || saidaLiberada (false)`, que é `false`. Por isso aparece "Descartar esta oferta? O que você preencheu será perdido.". Confirmando, o código liga `saidaLiberada` e navega para `/inicio`. Só que o `subscribe` de `criar()` (linha 119) não é cancelado quando o componente é destruído. O POST termina, a oferta é gravada, e o `next` (linhas 121-123) do componente já destruído chama `router.navigate(['/ofertas', id], { queryParams: { publicada: 1 } })`. Sair por link durante o envio dá no mesmo, porque o guard faz a mesma pergunta.
   Regra violada: tratamento de estado que não cumpre o que a própria tela promete. O diff põe na tela um "será perdido" que o código não garante. Esse ponto esbarra no revisor de conformidade (CA6 "nada é registrado", com o CA12 da rede lenta), mas o defeito nasce no código desta tarefa: um botão novo sem a trava de `enviando()`, ligado a uma assinatura que sobrevive ao componente.
   Prejuízo concreto: com a rede lenta, o cenário que o CA12 já prevê, o motorista confirma o descarte, vê a tela Início e, um instante depois, cai em "Oferta publicada." de uma oferta que ele mandou descartar. Nenhum teste cobre "Cancelar" ou link durante o envio. O `Subject` que o bloco do CA12 já usa permitiria escrever esse teste.

## Sugestões (não bloqueiam)

- **Voltar do navegador com recusa estraga o histórico. Vale conferir isso na verificação manual que o usuário decidiu fazer.** O `app.config.ts:10` usa `provideRouter(routes, withComponentInputBinding())` sem `withRouterConfig({ canceledNavigationResolution: 'computed' })`. No padrão (`'replace'`), quando um guard recusa uma navegação vinda do "voltar", o Router troca a entrada anterior do histórico (ex.: `/inicio`) por `/ofertas/nova`. O próximo "voltar" pula essa tela. Por isso o comentário em `confirmar-descarte.guard.ts:10` ("vale para ... voltar do navegador") só é verdade pela metade. Não consegui provar isso por teste: é o mesmo `Location.back()` que o TestBed não reproduziu. Na conferência manual, recuse a pergunta e aperte "voltar" de novo. Mexer em `app.config.ts` sai dos arquivos previstos, então a decisão é do usuário.
- **A regra "pergunta só se há o que perder" está escrita duas vezes.** Uma em `confirmar-descarte.guard.ts:12` (`tela.podeSair() || window.confirm(...)`), outra em `ride-offer-form.ts:94` (`!this.podeSair() && !window.confirm(...)`). Isso segue o plano ("descarte já confirmado pelo Cancelar ... a pergunta não aparece duas vezes"), por isso não bloqueia. Há um caminho mais simples: o `cancelar()` só navega para `/inicio` e deixa o guard perguntar, e assim `saidaLiberada` só precisaria existir para o caso de publicar. O ganho aparece no dia em que o `window.confirm` virar o `Modal` de `shared/components/` (Seção 4): a troca seria feita em um lugar só.
- **O guard tem nome genérico, mas a mensagem é da oferta.** `confirmarDescarteGuard` e `PodeSair` servem para qualquer tela, só que `MENSAGEM_DE_DESCARTE` em `core/guards/` diz "Descartar esta oferta?". Se outra tela reaproveitar o guard, vai perguntar sobre "oferta". O jeito é deixar a mensagem com a tela ou dar ao guard um nome do domínio. Não bloqueia porque hoje existe um uso só.
- **Há um teste preso à marcação.** `ride-offer-form.spec.ts:719` confere `botao.type === 'button'`. O comportamento que importa (o "Cancelar" não envia) já está provado em `:748`, que quebraria se o botão fosse `submit`, porque o submit chamaria `criar`. O teste da linha 719 só atrapalha numa refatoração, como trocar por um botão de `shared/`. Dá para removê-lo ou reescrevê-lo pelo efeito.

## Observações fora do escopo deste diff

- `ride-offer-form.ts:119`: o `subscribe` de `criar()` não tem `takeUntilDestroyed`. Isso vem das Tarefas 7 e 9 e é a raiz do apontamento 1: antes deste diff, sair pelo link do Header durante o envio já levava o usuário embora de onde ele tinha ido. Candidata a Issue de manutenção se a correção do apontamento 1 não resolver isso junto.
- A seção 4 do `docs/architecture.md` lista os guards como "(authGuard, roleGuard)". O `roleGuard` não existe mais (v1.1.1) e o `confirmarDescarteGuard` ainda não aparece. O plano já prevê atualizar isso no fechamento da issue.

Arquivos citados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\guards\confirmar-descarte.guard.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\guards\confirmar-descarte.guard.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.config.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.routes.ts
