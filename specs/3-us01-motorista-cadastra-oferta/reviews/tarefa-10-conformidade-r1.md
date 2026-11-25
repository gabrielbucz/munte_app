# Parecer de Conformidade — Tarefa 10

**Veredito:** APONTAMENTOS

Os testes rodaram pelo PowerShell com `C:` em maiúsculo: **17 arquivos de teste e 124 testes, todos passando.** O diff lido foi `git diff aa45af6` (no índice, seis arquivos). Nenhum arquivo foi alterado nesta revisão.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA6: "Cancelar" com o formulário alterado pergunta "Descartar esta oferta? O que você preencheu será perdido." | atendido | `ride-offer-form.ts:93-98`, `ride-offer-form.html` (botão `type="button"`), `confirmar-descarte.guard.ts:3`. Teste: `ride-offer-form.spec.ts` "com o formulário alterado, 'Cancelar' pergunta uma vez…" |
| CA6: confirmando, nada é gravado e o motorista vai para Início | atendido (fora do caso do apontamento 1) | Os testes de "Cancelar" e do link confirmam que `criar` não é chamado e que a URL fica `/inicio`. O mesmo vale para o formulário completo e válido. |
| CA6: recusando, ele continua no formulário com o que preencheu | atendido | `cancelar()` retorna cedo e o guard devolve `false`. Testes "…recusado mantém a tela…" e "sair por um link e recusar…" checam a URL `/ofertas/nova` e os valores de Bairro e Horário. |
| CA6: sair por um link com o formulário alterado pergunta | atendido | `app.routes.ts` (`canDeactivate: [confirmarDescarteGuard]`), `confirmar-descarte.guard.ts:11-12`. Testes "sair por um link pergunta / recusar". |
| CA6: sair pelo voltar do navegador com o formulário alterado pergunta | atendido no código, sem prova automatizada | O guard é o mesmo `canDeactivate`, e o Router o aplica também a navegações por `popstate`. Nenhum teste no diff cobre esse caminho (ver apontamento 2). |
| CA6: com o formulário intocado, sair não pede confirmação | atendido | `podeSair()` usa `form.pristine` (`ride-offer-form.ts:88-90`). Testes "intocado, 'Cancelar' leva a /inicio sem perguntar" e "só passando pelos campos… não pergunta" (só blur, sem alterar nada). |
| Plano: depois de publicar, sair não pergunta | atendido | `saidaLiberada.set(true)` no `next` (`ride-offer-form.ts:122`). Teste "depois de publicar…". |
| Plano: guard libera com `podeSair()` verdadeiro e pergunta com falso | atendido | `confirmar-descarte.guard.spec.ts`, 3 casos: libera, pergunta com o texto exato, devolve a resposta. |
| Abandono: fechar a aba | fora desta tarefa (fora de escopo na spec) | O comentário em `confirmar-descarte.guard.ts:10` registra que fechar a aba não passa pelo guard. É coerente com a spec. |

**Escopo:** os arquivos alterados são exatamente os previstos no plano (`core/guards/confirmar-descarte.guard.{ts,spec.ts}`, `ride-offer-form.{ts,html,spec.ts}`, `app.routes.ts`). Não há comportamento além do que o CA6 e a seção "Descarte (CA6)" do plano pedem. O teste "depois de uma falha de rede… ainda pergunta" está dentro do CA6, porque o formulário continua alterado. Não aparecem termos novos de domínio fora do glossário.

## Apontamentos
1. **"Cancelar" (e a saída por link) durante "Publicando…" confirma um descarte que não acontece: a oferta é gravada mesmo assim e o motorista é tirado da tela Início** — `ride-offer-form.html` (botão "Cancelar" sem `[disabled]`), `ride-offer-form.ts:93-98`, `ride-offer-form.ts:119-124`
   Critério violado: CA6, decisão da equipe: "desistir é tocar em 'Cancelar' … Confirmando, nada é gravado e o motorista vai para a tela Início". Também a seção Abandono: "O motorista toca duas vezes em 'Publicar' com a rede lenta".
   Evidência: durante o envio (CA12) o formulário está alterado e `saidaLiberada` ainda é `false`, então "Cancelar" continua ligado e abre a pergunta "…O que você preencheu será perdido."
   - Ao confirmar, `cancelar()` faz `saidaLiberada.set(true)` e vai para `/inicio`.
   - A inscrição em `rideOfferService.criar(nova).subscribe(...)` não é cancelada ao destruir o componente.
   - Quando o POST termina, a oferta já foi gravada e o `next` chama `router.navigate(['/ofertas', oferta.id], { queryParams: { publicada: 1 } })`. O motorista sai de Início e vai para a oferta que ele acabou de "descartar".
   - O mesmo acontece pelo link: o guard pergunta e, confirmando, a navegação segue enquanto a requisição continua.

   Nenhum teste cobre "Cancelar" ou link com envio em andamento. A premissa "cadastro parcial" do CA6 não vale ao pé da letra aqui, porque o formulário está completo e o envio já foi pedido. Mesmo assim, o app mostra uma confirmação de descarte cuja promessa ("nada é gravado", "vai para a tela Início") não cumpre. Fica para a sua triagem dizer se isso cabe no CA6 desta tarefa ou se é uma nova Issue.

2. **O trecho "pelo voltar do navegador" do CA6 não tem prova automatizada, e a spec não o lista entre as conferências manuais** — `ride-offer-form.spec.ts` (bloco "descartar um cadastro pela metade (CA6)")
   Critério violado: CA6, decisão da equipe: "sair da tela por um link ou pelo voltar do navegador com o formulário já alterado. Nos dois casos aparece a confirmação…". A seção Abandono repete: "sair por um link/voltar do navegador".
   Evidência:
   - Os testes de saída usam só `Router.navigateByUrl('/inicio')` (`sairPorLink`). Nenhum teste dispara um `popstate` ou `Location.back()`.
   - No código, o caminho está coberto pelo mesmo `canDeactivate`, então não vejo defeito funcional.
   - Pela regra do revisor, "teste que não roda não conta como critério atendido". A seção "Fora de escopo" da spec só declara a aparência como conferida manualmente ("com prints no PR"), não o voltar do navegador.
   - Removendo os dois testes por decisão sua, a conferência manual precisa deixar evidência própria: registro em `tarefa-10-decisoes-r1.md` e no PR, como os prints da aparência. Senão nada prova esse trecho do CA6 na defesa.

   Sugestão para a conferência manual, fora o caminho feliz: recusar a pergunta no voltar e checar que o formulário mantém os valores e que um segundo "voltar" se comporta como esperado. Com o `canceledNavigationResolution` padrão (`'replace'`, e `app.config.ts` não o altera), o Router reescreve a entrada do histórico depois da recusa. Só no navegador dá para ver se o motorista percebe algo estranho.

## Observação (não é apontamento)
- A spec diz "Confirmando, nada é gravado e o motorista vai para a tela Início" logo depois de citar link e voltar do navegador. Pode ser lida como "toda saída confirmada termina em Início". O código leva ao destino do link ou do voltar, e só o "Cancelar" vai fixo para `/inicio`. Por exemplo, o link "Entrar" do Header (`header.ts:18`) termina em `/entrar`.
- O plano aprovado e o texto da tarefa adotam essa leitura, e o teste do link usa um destino `/inicio`, que serve às duas leituras. Por isso não reprovo. Fica registrada a ambiguidade, caso você queira deixá-la explícita na spec.

Arquivos relevantes:
- C:\Users\Gabriel\Desktop\munte_app\specs\3-us01-motorista-cadastra-oferta\spec.md
- C:\Users\Gabriel\Desktop\munte_app\specs\3-us01-motorista-cadastra-oferta\plan.md
- C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\guards\confirmar-descarte.guard.ts
- C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\guards\confirmar-descarte.guard.spec.ts
- C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts
- C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html
- C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts
- C:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.routes.ts
