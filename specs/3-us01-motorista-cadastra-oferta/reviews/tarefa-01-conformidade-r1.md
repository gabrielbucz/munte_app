# Parecer de Conformidade — Tarefa 1

**Veredito:** APROVADO

## Critérios verificados
| Critério (da spec) | Situação | Onde |
| --- | --- | --- |
| CA13: sem sessão, abrir o formulário de nova oferta leva à tela Entrar | atendido | `apps/web/src/app/app.routes.ts:20-25` (rota `ofertas/nova` com `canActivate: [authGuard]`, o mesmo guard da tela Início, como diz a decisão da equipe); teste em `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.spec.ts:60-67` (rotas reais, `Router.url` termina em `/entrar`) |
| CA13 (com sessão): a rota abre o formulário com sentido, bairro (com os bairros do service), ponto, horário, vagas e observações | atendido | `apps/web/src/app/features/driver/ride-offer-form/ride-offer-form.html:5-77`, `ride-offer-form.ts:13-24`; teste em `ride-offer-form.spec.ts:69-97` (localiza cada campo pelo rótulo e confere o tipo: radios Ida/Volta, `select` de bairro com "Centro" e "Vila Nova" vindos do service, `select` de ponto, `datetime-local`, `number`, `textarea`) |
| CA15: com sessão, a navegação (barra superior no desktop, gaveta no mobile) mostra o link "Oferecer carona", que abre o formulário | atendido | `apps/web/src/app/shared/components/header/header.ts:15-20`; teste em `apps/web/src/app/shared/components/header/header.spec.ts:49-65` (confere `href="/ofertas/nova"` na barra e, depois de abrir pelo ☰, também na gaveta). Que o link de fato "abre o formulário" vem da soma desse teste do `href` com o teste da rota em `ride-offer-form.spec.ts:69-97` |
| Plano, `GET /neighborhoods?_embed=pickupPoints` | atendido | `apps/web/src/app/core/services/neighborhood.service.ts:12-16`; teste em `neighborhood.service.spec.ts:25-47` (URL, parâmetro `_embed`, método e corpo devolvido) |
| Premissa "Assume que" (bairros de exemplo no json-server, #35) | atendido | `apps/api/db.json` (3 bairros com 3 pontos cada); `// TODO #35` em `ride-offer-form.ts:12` |
| Glossário do `docs/architecture.md` (`Neighborhood`, `PickupPoint`, `RideDirection` com `'outbound' \| 'return'`) | atendido | `apps/web/src/app/core/models/neighborhood.ts:1-12`; `ride-offer-form.ts:19` |
| CA1–CA12, CA14 | fora desta tarefa | Ficam nas Tarefas 2 a 10. O formulário ainda não tem validadores, nem opções no campo ponto, nem botão "Publicar". Isso está correto para esta tarefa e não é escopo faltando. |

Testes: rodei pelo PowerShell com `C:` maiúsculo. Passaram 13 arquivos de teste e 55 testes, incluindo os 4 novos ou alterados desta tarefa.

## Apontamentos

Nenhum apontamento bloqueante. Ficam duas observações que **não são apontamentos**, só para registro:
- O link "Oferecer carona" aparece também para quem está sem sessão. Isso não é escopo inflado. O `plan.md` (seção "Navegação (CA15)") decidiu assim de propósito, porque o `Header` não pode importar `core/`. Sem sessão, o guard leva à tela Entrar (CA13), e a spec não pede que o link fique escondido sem sessão.
- O teste em `apps/web/src/app/core/services/neighborhood.service.spec.ts:25` está rotulado "CA15", mas o que ele prova (a origem dos bairros do formulário) tem mais a ver com os campos do CA13 com sessão. É só o rótulo do teste, a cobertura não muda. Se convier ajustar, quem decide isso é o revisor de código ou o usuário.

Arquivos revisados:
- c:\Users\Gabriel\Desktop\munte_app\apps\api\db.json
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.routes.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\models\neighborhood.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\neighborhood.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\neighborhood.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.html
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\features\driver\ride-offer-form\ride-offer-form.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\shared\components\header\header.spec.ts

Não alterei nenhum arquivo. Este parecer precisa ser gravado pelo fluxo em `c:\Users\Gabriel\Desktop\munte_app\specs\3-us01-motorista-cadastra-oferta\reviews\tarefa-01-conformidade-r1.md`.
