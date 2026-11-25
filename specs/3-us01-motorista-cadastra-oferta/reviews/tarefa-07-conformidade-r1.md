# Parecer de Conformidade — Tarefa 7

**Veredito:** APROVADO

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA1: a oferta é gravada com status "Disponível" (`status: 'available'`) | atendido | `apps/web/src/app/core/services/ride-offer.service.ts:22`; provado em `ride-offer.service.spec.ts:113` (`toStrictEqual` no corpo do POST) |
| CA1: "entra nas minhas ativas" = gravada com o motorista que a criou (e-mail da sessão) | atendido | `ride-offer.service.ts:19`; provado em `ride-offer.service.spec.ts:113` com `AuthService.sessao` simulado (`driverId: 'motorista@alunos.utfpr.edu.br'`) |
| CA1 (plano): `availableSeats` nasce igual a `totalSeats`, `createdAt` em ISO, sem `id` no envio | atendido | `ride-offer.service.ts:21-25`; provado em `ride-offer.service.spec.ts:113` com relógio parado (`createdAt: '2026-11-24T15:45:10.123Z'`) |
| CA1: a confirmação leva à tela da oferta criada `/ofertas/<id>` com o aviso "Oferta publicada." | atendido | Navegação: `ride-offer-form.ts:83-85`, provada em `ride-offer-form.spec.ts:474` (`/ofertas/42?publicada=1`). O aviso com `?publicada` já existe desde a Tarefa 6 (`ride-offer-detail.html:3-4`, `ride-offer-detail.spec.ts:93`) |
| CA2: o ponto dos fixos e as observações ficam salvos | atendido | `ride-offer-form.ts:70-81` monta a `NovaRideOffer` com o que foi digitado; provado em `ride-offer-form.spec.ts:454` (`toHaveBeenCalledWith` exato, horário convertido para ISO sem depender do fuso) |
| CA2: observações são opcionais (vazias vão como `''`) | atendido | `ride-offer-form.spec.ts:468` |
| Plano: coleção `rideOffers: []` no json-server, para o `POST /rideOffers` existir | atendido | `apps/api/db.json` (última chave) |
| Plano: tipo `NovaRideOffer` em `core/models/ride-offer.ts` | atendido | `apps/web/src/app/core/models/ride-offer.ts:24-27` |
| Testes rodam | atendido | `npm test` pelo PowerShell (`C:` maiúsculo): 16 arquivos, 96 testes, todos passando |

## Escopo
- Os arquivos alterados são exatamente os previstos na Tarefa 7: `apps/api/db.json`, `core/models/ride-offer.ts`, `core/services/ride-offer.service.{ts,spec.ts}` e `features/driver/ride-offer-form/ride-offer-form.{ts,html,spec.ts}`.
- Nada foi adiantado de tarefas futuras: não há tratamento de `FalhaDeRedeError` nem mensagem do CA11 (Tarefa 8), não há sinal `enviando` nem "Publicando…" (Tarefa 9; o botão continua `[disabled]="form.invalid"`), e não há "Cancelar" nem guard de descarte (Tarefa 10). Hoje o `subscribe` em `ride-offer-form.ts:83` não tem callback de erro. Isso é esperado nesta etapa, porque o CA11 é da Tarefa 8.
- A troca do tipo de `direction` de `'outbound' | 'return' | ''` para `RideDirection | ''` (`ride-offer-form.ts:26`) não muda comportamento. Ela usa o termo `RideDirection` do glossário.
- O `sessao()!` em `ride-offer.service.ts:19` parte do princípio de que a sessão existe. A rota tem `authGuard` (CA13), e a sessão que expira no meio do preenchimento está fora desta história pela spec (US13, #23). Não é falha de conformidade.

## Apontamentos

Nenhum.

Observação, não bloqueante: o teste de navegação (`ride-offer-form.spec.ts:474`) simula `buscarPorId` devolvendo `null`. Por isso a tela de destino mostra "Oferta não encontrada." e o teste confere só a URL. A cadeia completa do CA1 (publicar, cair na tela, ver "Oferta publicada." e os dados) está provada em duas partes: a URL aqui e o aviso no `ride-offer-detail.spec.ts:93`. Não há um teste que cubra a cadeia inteira de uma vez. Isso não viola nenhum critério.

Arquivos relevantes:
- c:\Users\Gabriel\Desktop\munte_app\apps\api\db.json
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\models\ride-offer.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\ride-offer.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\ride-offer.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts
