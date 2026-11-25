# Parecer de Conformidade — Tarefa 8

**Veredito:** APROVADO

A Tarefa 8 atende ao CA11 e não encontrei apontamento bloqueante. A suíte inteira passa: rodei `npm test` pelo PowerShell em `C:\Users\Gabriel\Desktop\munte_app\apps\web` e deu 16 arquivos de teste e 104 testes aprovados, sem falha e sem teste pulado.

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA11 — servidor não responde: `status 0` vira `FalhaDeRedeError` (Decisão técnica do plan.md, linha 22) | atendido | `apps/web/src/app/core/services/ride-offer.service.ts:26-34` (`catchError`: `HttpErrorResponse` com `status === 0` vira `new FalhaDeRedeError()`, o resto segue como veio). Teste: `ride-offer.service.spec.ts:138-144` (`.error(new ProgressEvent('error'))` termina em `rejects.toBeInstanceOf(FalhaDeRedeError)`). |
| CA11 — aparece "Não foi possível publicar a oferta. Verifique sua conexão e tente novamente." | atendido | `ride-offer-form.html:150-154` (`role="alert"`, texto idêntico ao da spec). `ride-offer-form.ts:93-97` liga `falhaDeRede`. Teste: `ride-offer-form.spec.ts` "mostra a mensagem de falha como alerta…", que compara o texto exato e confere que a URL continua `/ofertas/nova`. |
| CA11 — "o que preenchi continua no formulário" | atendido | Na falha o código não chama `reset` nem navega (`ride-offer-form.ts:93-99`). Teste: "o que foi preenchido continua no formulário" confere os seis campos: sentido Ida, bairro, ponto, horário, vagas e observações. |
| CA11 — "posso tocar em 'Tentar novamente'" | atendido | `ride-offer-form.html:165`: o botão de envio troca o rótulo para "Tentar novamente". Testes: o botão aparece ligado, com `type="submit"`, e "Publicar" some; tocar nele reenvia com `toStrictEqual` os mesmos dados do primeiro envio e, com sucesso, vai para `/ofertas/42?publicada=1`. |
| Abandono no meio — "O servidor cai… O app avisa, mantém o que foi digitado e permite tentar de novo sem redigitar" | atendido | Os mesmos pontos do CA11. O teste de reenvio não redigita nada. |
| Fora de escopo — "Tempo limite (timeout) próprio… só a falha que o navegador reporta" | respeitado | Não há `timeout` no `pipe`. Só o `status 0` é tratado como falha de rede. |
| Glossário do `docs/architecture.md` | atendido | Não surgiu termo novo: `FalhaDeRedeError` é a classe que o `AuthService` já exporta, reaproveitada como o plano pede, e `falhaDeRede` é o signal que a linha 31 do plano prevê. |

## Escopo
- O diff mexe só nos arquivos que o plano prevê: `ride-offer.service.{ts,spec.ts}` e `ride-offer-form.{ts,html,spec.ts}`.
- Nada das próximas tarefas entrou antes da hora. Não há signal `enviando` nem "Publicando…" (Tarefa 9): o botão continua com `[disabled]="form.invalid"`. Também não há "Cancelar" nem guard de descarte (Tarefa 10).
- Duas coisas que a spec não pede com todas as letras. Nenhuma das duas bloqueia, mas cabe ao usuário decidir se ficam:
  - **Erro que não é de rede (ex.: 500) vai para o `ErrorHandler`** (`ride-offer-form.ts:98`, com testes no service e no formulário). Não muda nada que o usuário veja: não aparece mensagem e o formulário continua como estava. Isso só garante que o erro não seja engolido, e segue o padrão já aprovado na US12 (D1/D1b, `login.ts`). Também responde à recomendação do `tarefa-07-codigo-r1.md`. Não conto como escopo inflado.
  - **A mensagem de falha some ao tocar em "Tentar novamente"** (`ride-offer-form.ts:88`, com teste usando um `Subject` pendente). A spec não fala disso, mas é consequência natural de tentar de novo: o aviso não pode continuar valendo para um envio que ainda está em andamento.
- Ponto a observar na Tarefa 9 (não é defeito desta): enquanto o reenvio está pendente, o botão volta a dizer "Publicar" e fica ligado. O CA12 está planejado para a Tarefa 9, então isso é esperado nesta etapa.

## Apontamentos

