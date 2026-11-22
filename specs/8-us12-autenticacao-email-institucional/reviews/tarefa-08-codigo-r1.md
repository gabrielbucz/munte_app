# Parecer de Código: Tarefa 8

**Veredito:** APONTAMENTOS

Verificação: `npm test` passou nas 11 suítes, 44 de 44 testes. `npm run lint` não acusou nada. Rodei os dois pelo PowerShell com o drive em maiúsculo. O diff analisado é `git diff 2f7d9e98ef2f8525cdb6543b27c9fb20a870b3e4`, com 6 arquivos, todos previstos no plano.

## Apontamentos (bloqueiam)

1. **O teste do guard depende de como o AuthService guarda a sessão, e não do contrato dele.** Ver `apps/web/src/app/core/guards/auth.guard.spec.ts:17-21`:
   ```ts
   if (comSessao) {
     localStorage.setItem('munte.sessao', JSON.stringify(SESSAO));
   }
   ```
   O guard só lê `inject(AuthService).autenticado()`. Mesmo assim, as 4 provas do spec do guard montam o AuthService real, com `provideHttpClient` e `provideHttpClientTesting`, e criam a sessão gravando direto no `localStorage` com a chave `'munte.sessao'`. Essa chave é uma constante privada do serviço (`CHAVE_DA_SESSAO`, em `auth.service.ts:8`) e foi copiada à mão para o teste.
   Regras violadas:
   - `docs/architecture.md` §2: "A troca de json-server → Supabase atinge apenas os Services em apps/web/src/app/core/services/. Componentes, guards, interceptors não mudam".
   - §8: o resto da aplicação, guards incluídos, "não sabe nem se importa de onde vêm os dados".
   - Item do revisor: "teste acoplado a detalhe de implementação, que quebra em qualquer refatoração".
   Prejuízo concreto: o próprio serviço avisa, em `auth.service.ts:42`, que na #25 a sessão deixa o `localStorage` e passa a vir do Supabase Auth. Quando isso acontecer, as 4 provas do guard vão quebrar sem que o guard tenha mudado uma linha. Também quebram se alguém só renomear a chave ou mudar o formato `{ email }`. Isso destoa da convenção que o repositório já segue: `inicio.spec.ts` e `auth-callback.spec.ts` trocam o AuthService por um falso com signals. Ali isso funciona até nas provas que usam as rotas reais, porque a Início lê `sessao()` do falso. No `auth.service.spec.ts`, mexer no `localStorage` está certo, porque é o mecanismo do próprio serviço.
   Para a triagem: o plano define a chave `munte.sessao` como decisão do AuthService. Ele não pede que o teste do guard a use.

## Sugestões (não bloqueiam)

- `auth-callback.spec.ts:21-22`: no AuthService falso, `autenticado: signal(true)` e `sessao` são independentes. Hoje não faz diferença. Se algum teste futuro trocar só um dos dois, o falso fica incoerente. Dá para derivar um do outro (`computed(() => sessao() !== null)`), mas isso é robustez, não defeito.

## Pontos conferidos sem problema

- `auth.guard.ts` está conforme a arquitetura: guard funcional (`CanActivateFn`), usa `inject()`, devolve `UrlTree` com `createUrlTree(['/entrar'])` e não usa o `navigate` imperativo (ID19, §1). Ele fica em `core/guards/` e só importa `core/services` (regra de dependência da §4).
- `autenticado = computed(...)` em cima do signal somente leitura atende a §1 e ao ID10. É exatamente o que o plano define.
- `app.routes.ts`: `''` → `inicio` com `pathMatch: 'full'`, e `canActivate: [authGuard]` junto do `loadComponent` lazy (§1, ID16).
- Não há segredo nem URL de ambiente no código, nem `catch` que engula erro, nem abstração criada para um caso só. Não há outro guard ou checagem de sessão no repositório que esta mudança duplique.

## Observações fora do escopo deste diff

- `auth.service.ts:94-97`, de antes desta tarefa: `lerSessao` faz `JSON.parse` sem tratar erro. Um valor corrompido em `munte.sessao` derruba a criação do AuthService e, com isso, o app e o guard. Candidata a Issue de manutenção, ou a ser tratada na US13 (#23), que cuida da validade da sessão.
