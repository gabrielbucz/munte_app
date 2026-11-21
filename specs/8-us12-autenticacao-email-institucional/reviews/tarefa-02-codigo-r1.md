# Parecer de Código — Tarefa 2

**Veredito:** APROVADO

Revisei o diff inteiro (`git diff f26497ada64bf878fec08fe78e437b61bc0f2372`, trabalho que está no índice) contra `docs/architecture.md` e `.agents/rules/01-angular-strict-rules.md`. Rodei os comandos pelo PowerShell em `C:\Users\Gabriel\Desktop\munte_app`:
- `npm test`: 6 arquivos e 15 testes, todos passando. Isso inclui `auth.service.spec.ts`.
- `npm run lint`: nenhum erro, nenhum aviso.

Não alterei nenhum arquivo.

Pontos que conferi e que estão de acordo com a arquitetura:
- O `AuthService` está em `core/services/`, usa `providedIn: 'root'` e `inject(HttpClient)` (Seção 1, ID15). Não há injeção por construtor nem `any`.
- O acesso à API fica só no Service (Data Layer Rule; Seção 2, regra de migração).
- Nada em `core/` importa de `shared/` ou `features/` (Seção 4, regra de dependência).
- `provideHttpClient()` está registrado em `app.config.ts` (ID4).
- O erro de domínio não é engolido: sai como `EmailNaoPermitidoError` tipado pelo canal de erro do Observable, e a falha HTTP é repassada sem tratamento (fica para a Tarefa 6).
- Não achei regra duplicada. Busquei `utfpr.edu.br`, `localhost:3001` e `HttpClient` em `apps/web/src`, e essa é a única ocorrência da regra de domínio e da URL.
- Os testes cobrem o comportamento público: método, URL, corpo, link devolvido, tipo do erro e ausência de requisição. Eles não espiam métodos privados. O relógio simulado (`vi.useFakeTimers({ toFake: ['Date'] })`) e o `http.verify()` no `afterEach` estão bem usados.

## Apontamentos (bloqueiam)

Nenhum.

## Sugestões (não bloqueiam)

- **A URL do servidor está escrita no código** — `apps/web/src/app/core/config/api.config.ts:2` (`export const API_URL = 'http://localhost:3001';`)
  A lista do revisor de código diz que "URL de ambiente escrita no código" reprova. Mesmo assim, deixei como sugestão:
  - o `plan.md` aprovado (seção "Dados") decidiu exatamente isso;
  - a URL está num único arquivo, marcado com `TODO #25`;
  - no MVP o json-server só roda na máquina local;
  - o `architecture.md` não declara um mecanismo de ambiente para o front.

  O risco existe se alguém rodar `ng build --configuration production` e publicar (ID28): o bundle vai apontar para `localhost`. Uma alternativa que tira a URL do código é um `proxy.conf.json` no `ng serve` (`/api` para `http://localhost:3001`), com chamadas relativas. Isso também evita problemas de CORS. A decisão de manter ou mudar é do usuário.
- **A checagem de domínio aceita mais de um `@`** — `apps/web/src/app/core/services/auth.service.ts:48-51`
  Como `dominioPermitido` usa `lastIndexOf('@')`, um endereço como `a@b@alunos.utfpr.edu.br` passa. O `Validators.email` da Tarefa 3 deve barrar esse caso na tela, mas o Service hoje confia nisso. Se o Service deve se proteger sozinho, basta exigir exatamente um `@`. Isso é mais da alçada do revisor de conformidade (CA3) do que de arquitetura.
- **Onde fica a interface `MagicLink`** — `auth.service.ts:9-15`
  A Seção 4 manda interfaces compartilhadas para `core/models/`. Hoje só o próprio Service usa `MagicLink`, e as Tarefas 7, 9 e 10 também ficam dentro dele, então não há violação. Se algum componente ou guard precisar desse tipo, mova para `core/models/magic-link.ts`.
- **`crypto.randomUUID()` só funciona em contexto seguro** — `auth.service.ts:38`
  Funciona em `localhost` e em HTTPS. Se alguém abrir o app pelo IP da rede local (por exemplo, para testar no celular via `ng serve --host`), a chamada falha. Vale saber antes da Tarefa 3, que é testada no mobile (CA8 e CA9).
- **Formatação** — `apps/web/src/app/app.config.ts:10-11`
  A lista de providers não tem vírgula no último item, ao contrário dos arquivos novos do diff. Não tem impacto prático; o `npm run format` resolve.

## Observações fora do escopo deste diff

- **`docs/architecture.md`, ID21, diz "Somente e-mails institucionais @utfpr.edu.br".** O código segue a spec e o PRD 1.3.0 e aceita só `@alunos.utfpr.edu.br`. A arquitetura está desatualizada nesse ponto e pode ser corrigida junto com a atualização de documentação já prevista no fechamento da Issue (Passo 4).
- **A Seção 8 e o diagrama ER do `architecture.md` ainda não têm `magicLinks`.** O plano já prevê essa atualização no fechamento. Fica registrado para não esquecer.
- **`apps/api/db.json` é versionado e o json-server roda com `--watch`.** Cada link solicitado em teste manual é gravado nesse arquivo, e esses dados podem ir parar num commit. Pode virar uma Issue de manutenção, por exemplo com um `db.seed.json` versionado copiado para um `db.json` ignorado pelo git.
- **O ID4 do `architecture.md` pede `provideAnimations()` no bootstrap, e o `app.config.ts` não tem.** Isso já era assim antes deste diff. Candidata a Issue de manutenção, ou a ajuste na arquitetura se animações não forem usadas.

Arquivos citados:
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\services\auth.service.spec.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\core\config\api.config.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\web\src\app\app.config.ts
- c:\Users\Gabriel\Desktop\munte_app\apps\api\db.json
- c:\Users\Gabriel\Desktop\munte_app\docs\architecture.md
