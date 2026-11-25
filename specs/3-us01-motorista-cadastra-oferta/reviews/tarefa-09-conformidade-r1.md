# Parecer de Conformidade — Tarefa 9

**Veredito:** APROVADO

O diff atende o CA12 e não encontrei nada bloqueante. Rodei `npm test` pelo PowerShell com `C:` maiúsculo: 16 arquivos de teste e 110 testes, todos passando. Nenhum arquivo foi alterado nesta revisão.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA12: com o envio em andamento, o botão fica desligado | atendido | `ride-offer-form.html:158` (`[disabled]="form.invalid \|\| enviando()"`), `ride-offer-form.ts:100` (`enviando.set(true)` antes do `subscribe`). Teste: `ride-offer-form.spec.ts`, "com o envio pendente, o botão fica desligado com o texto "Publicando…"" (usa um `Subject` que ainda não emitiu, como o plano pede) |
| CA12: o botão mostra o texto "Publicando…" | atendido | `ride-offer-form.ts:71-74` (`rotuloDoBotao`, que tem prioridade sobre "Tentar novamente" e "Publicar"), `ride-offer-form.html:165`. O teste confere `textContent` igual a `'Publicando…'` |
| CA12: um segundo toque não cria uma segunda oferta | atendido | `ride-offer-form.ts:84` (`if (this.form.invalid \|\| this.enviando()) return;`). Teste "um segundo toque ou um Enter não chamam o service de novo": clique de novo mais um `submit` no formulário, e `criar` é chamado 1 vez. O `submit` é o que exercita a trava no código, porque o clique num botão desligado nem dispara o evento. Sem ele, o teste só provaria o botão desligado. |
| CA12: depois do sucesso, enquanto a tela não saiu, não há segundo envio | atendido | `ride-offer-form.ts:102-105` (`enviando` continua ligado no `next`). Teste "depois do sucesso…": `criar` chamado 1 vez e URL `/ofertas/42?publicada=1` |
| Plano, Tarefa 9: o botão volta ao normal depois de uma falha | atendido | `ride-offer-form.ts:107` (`enviando.set(false)` no `error`). Dois testes: falha de rede volta como "Tentar novamente" e ligado, mantendo o CA11; erro 500 volta como "Publicar" e ligado |
| Decisão técnica do plano: `[disabled]="form.invalid \|\| enviando()"` e estado em signals `enviando`/`falhaDeRede` | atendido | `ride-offer-form.html:158`, `ride-offer-form.ts:66,69` |
| Sem regressão no CA9 e no CA11 | atendido | Os testes de CA9 e CA11 continuam passando. Agora `publicar()` também recusa formulário inválido que chega pelo Enter (`ride-offer-form.ts:84`), com o teste "com o formulário inválido, enviar pelo Enter não chama o service" |
| Glossário: `RideOfferForm`, `NovaRideOffer`, `RideOfferService` | atendido | Nenhum termo novo de domínio. `enviando` é o nome que o plano prevê |

## Escopo
- Os arquivos tocados são exatamente os que o plano prevê: `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`.
- Não há comportamento além do que a spec pede. A trava `form.invalid` em `publicar()` não é escopo inflado: ela só garante, pelo caminho do Enter, o que o CA9 já exige ("o botão "Publicar" fica desligado enquanto houver qualquer campo inválido"). Também fecha o mesmo atalho que o CA12 precisa fechar.
- Timeout próprio continua fora, como a spec manda ("Tempo limite (timeout) próprio para o envio" está em "Fora de escopo"). Nada no diff mexe nisso.
- O cenário "O motorista toca duas vezes em "Publicar" com a rede lenta", da seção "Abandono no meio", está coberto pelos testes com o `Subject` pendente.

## Apontamentos

