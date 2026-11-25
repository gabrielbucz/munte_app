# Parecer de Código — Tarefa 8

**Veredito:** APONTAMENTOS

Encontrei um apontamento que bloqueia: a regra "status 0 é falha de rede" agora está escrita em dois services. Ele é pequeno e você pode recusá-lo na triagem (a justificativa está no fim do item). Fora isso, o código segue o `architecture.md`. Os testes e o lint passam.

Diff revisado: `git diff 035edd5d423e387f2ba6b2dc75d44c08e91bd8db`, com 5 arquivos no índice.

Testes e lint (PowerShell, `C:` maiúsculo, em `apps/web`):
- `npm test`: 16 arquivos e 104 testes passando.
- `npm run lint`: nenhum erro nem aviso.

## Apontamentos (bloqueiam)

1. **A regra "status 0 = falha de rede" foi copiada em vez de reaproveitada** — `apps/web/src/app/core/services/ride-offer.service.ts:29-33`
   - Evidência: o `catchError` de `criar` traz `erro instanceof HttpErrorResponse && erro.status === 0 ? new FalhaDeRedeError() : erro`. Essa regra já existe em `apps/web/src/app/core/services/auth.service.ts:107-110`, no método privado `falhaDeRede(erro)`, usado em `auth.service.ts:64-66` com o mesmo `catchError(... throwError(...))`. Copiaram o predicado e também o operador inteiro.
   - Regra violada: o critério de reprovação do revisor para "duplicação de regra que já existe em outro lugar do repo". O `architecture.md` (seções 2 e 8) põe nos Services a tradução do erro de transporte, para que só eles mudem na troca de fonte de dados. Essa tradução deveria ter uma definição só, e hoje tem uma por service.
   - Prejuízo concreto:
     - Quando a definição de "o servidor não respondeu" mudar, cada cópia terá de ser achada e mudada. Isso acontece ao tratar timeout ou o 504 de um proxy, e na Entrega 3, quando o Supabase passar a entregar o erro em outro formato.
     - Se uma cópia for esquecida, o Entrar e o Publicar passam a discordar sobre o que é falha de rede, sem nenhum teste apontar isso.
     - O próximo service com escrita (solicitações, por exemplo) tende a criar a terceira cópia.
   - Ponto para a triagem: corrigir exige mexer em `auth.service.ts`, que não está nos "Arquivos previstos" da Tarefa 8. Basta exportar o predicado, ou um operador como `paraFalhaDeRede()`, e usar nos dois services. O plano (linha 22) decidiu reaproveitar a **classe** `FalhaDeRedeError`, mas não diz nada sobre a regra. Recusar com a justificativa "fora dos arquivos previstos; vira manutenção" é defensável.

## Sugestões (não bloqueiam)

- **Onde mora a `FalhaDeRedeError`.** A classe está em `auth.service.ts`, então `ride-offer.service.ts:6` e `features/driver/ride-offer-form/ride-offer-form.ts:7` importam o service de autenticação só para ter um erro genérico de transporte. A regra de dependência não é violada (feature importa core). Mas o nome do arquivo engana, e o acoplamento aumenta a cada service novo. Se o apontamento 1 for aceito, dá para levar a classe e o predicado para um arquivo próprio em `core/` na mesma correção.
- **Rótulo do botão em `ride-offer-form.html:165`.** O ternário `{{ falhaDeRede() ? 'Tentar novamente' : 'Publicar' }}` funciona hoje. A Tarefa 9 vai trazer um terceiro estado ("Publicando…", com `enviando`), e um ternário aninhado no template fica difícil de ler. Um `computed` com o rótulo no componente resolve, de preferência já na Tarefa 9.
- **Teste do erro 500 no componente** (`ride-offer-form.spec.ts:574`). O teste usa `new HttpErrorResponse({ status: 500 })` como "erro que não é de rede". O componente não conhece HTTP, então um `new Error('qualquer')` provaria o mesmo comportamento sem trazer HTTP para o teste da feature. O `login.spec.ts:234` faz igual, então está consistente e não bloqueia.
- **`ErrorHandler` falso em todos os testes do arquivo** (`ride-offer-form.spec.ts:57`, dentro de `configurar`). Ele vale também para os testes das Tarefas 1 a 7. Não mascara erro do framework, porque o handler interno do TestBed ainda relança. Ainda assim, deixar a troca só no `describe` do CA11 mostraria melhor a intenção. É o mesmo padrão do `login.spec.ts:30`.

## Observações fora do escopo deste diff

- Os erros que não são de rede (500, 4xx) vão para o `ErrorHandler` e o usuário não vê nada na tela. Isso vale aqui e no Login (`features/auth/login/login.ts:45`). Não há tratamento de erro central: o `errorInterceptor` que o `architecture.md` (seção 7, ID23) promete ainda não existe. Candidato a Issue de manutenção, e quem decide se é lacuna da spec é o revisor de conformidade.
- `RideOfferService.criar` (`ride-offer.service.ts:20`) usa `this.authService.sessao()!.email` e confia no `authGuard`. Isso veio da Tarefa 7 e este diff não mexeu.

Não gravei nem alterei nenhum arquivo. O Bash serviu só para o `git diff`, os testes e o lint.
