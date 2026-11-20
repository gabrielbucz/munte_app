---
issue: 8
status: rascunho   # rascunho | aprovada
---

# US12 — autenticação por e-mail institucional

## O problema

Alunos de graduação da UTFPR precisam entrar no app de caronas para oferecer ou solicitar vagas, mas hoje o app não tem autenticação nem uma casca de navegação: a página inicial é só a vitrine dos tokens de design, e nenhuma rota é exibida. Sem acesso controlado, não há como garantir que só alunos com vínculo ativo usem o app, e as demais histórias não têm onde aparecer. O acesso precisa ser por e-mail institucional, validado por link de confirmação, sem cadastro manual nem senha local.

## A história

**Como** aluno de graduação da UTFPR, **eu quero** entrar com meu e-mail institucional (@alunos.utfpr.edu.br), **para que** meu vínculo seja verificado por link de confirmação, sem cadastro manual nem senha local.

## Critérios de aceite

- [ ] **CA1 — Dado** informo um e-mail institucional @alunos.utfpr.edu.br, **quando** solicito acesso, **então** o sistema envia um link de confirmação por e-mail.
- [ ] **CA2 — Dado** clico no link de confirmação recebido dentro do prazo de validade (1 hora), **quando** tento entrar, **então** o acesso libera com vínculo ativo.
  - *Decisão da equipe:* liberar o acesso é levar o aluno à tela **Início**, uma tela mínima protegida pelo guard que mostra o e-mail com que ele entrou (ex.: "Você entrou como fulano@alunos.utfpr.edu.br"). Sem sessão válida, a tela Início não é exibida.
- [ ] **CA3 — Dado** uso um e-mail não institucional ou um link expirado/inválido, **quando** tento entrar, **então** exibe "e-mail não permitido ou link inválido" e bloqueia o acesso.
- [ ] **CA4 — Dado** que o usuário solicitou um link de confirmação e não o utilizou dentro do prazo de validade, **quando** tentar autenticar com esse link expirado, **então** o acesso será bloqueado e o usuário poderá solicitar um novo link.
- [ ] **CA6 — Dado** que ocorre uma falha de rede durante o envio do e-mail de confirmação, **quando** o usuário solicitar acesso, **então** o sistema deverá informar o erro e permitir uma nova tentativa.
- [ ] **CA7 — Dado** que o usuário acessa uma tela da aplicação, **quando** a rota correspondente é apresentada, **então** o conteúdo da tela deve ser renderizado no palco central, entre o cabeçalho e o rodapé da App Shell.
  - *Decisão da equipe:* no desktop, a navegação fica na barra superior do cabeçalho (opção A, como o "Nav superior" do protótipo Tablet); no mobile, os links saem da barra e vão para a gaveta aberta pelo ☰.
- [ ] **CA8 — Dado** que a aplicação está em visualização mobile e a gaveta está fechada, **quando** o usuário toca no botão ☰, **então** a gaveta de navegação é aberta e apresenta o link da história.
- [ ] **CA9 — Dado** que a gaveta mobile está aberta, **quando** o usuário toca no link da história, **então** a gaveta é fechada e a tela correspondente à história é apresentada.
  - *Decisão da equipe (CA8 e CA9):* o link da história é **"Entrar"**, e a tela correspondente é a tela de login.

> A numeração segue o `docs/prd.md` (1.3.0). Não há CA5 nesta história: ele pertence à US13 (#23).

## Fora de escopo

- Recuperação de sessão expirada ao acessar rota protegida (CA5) — é a US13 (#23).
- Envio real de e-mail e autenticação pelo Supabase Auth — Entrega 3, Issue #25 (ver "Assume que").
- Cadastro manual de usuário com senha local.
- Login por provedores sociais ou portal UTFApps (OAuth).
- Recuperação de senha (não há senha local; o link de confirmação é o único fator).
- Acesso de servidores: e-mails `@utfpr.edu.br` são tratados como não permitidos (CA3), pois o app é restrito a alunos (PRD 1.3.0).
- Bloqueio por nível de curso: a pós-graduação não é público-alvo, mas o domínio `@alunos.utfpr.edu.br` não distingue graduação de pós (PRD 1.3.0, Fora de Escopo).
- Links de navegação para as telas de outras histórias — cada história traz o próprio link.
- Aparência (rodapé colado no fim da tela, layout mobile × desktop, fidelidade ao protótipo): conferida manualmente no navegador, com prints no PR, e não por teste automatizado.

## Abandono no meio

- O aluno fecha a aba depois de solicitar o link e antes de clicar nele: o link continua válido até completar 1 hora; depois disso, usá-lo é bloqueado e ele pode solicitar outro (CA4).
- A rede cai (ou o json-server está fora do ar) no envio da solicitação: o sistema informa o erro e permite tentar de novo, sem precisar redigitar o e-mail (CA6).
- O aluno clica num link já usado, adulterado ou incompleto: o acesso é bloqueado com a mensagem do CA3.
- A sessão expira depois do acesso: fora desta história — é a US13 (#23).

## Assume que

| Premissa | Issue que fecha |
| --- | --- |
| O envio do e-mail de confirmação é simulado: após a solicitação, o link é exibido na própria tela, num quadro identificado como "E-mail simulado". O envio real pelo Supabase Auth fica para a Entrega 3. | #25 |
| Os links de confirmação (coleção `magicLinks` no `apps/api/db.json`, com e-mail, token, validade e uso) e a sessão (no `localStorage`) são guardados pelo json-server e pelo navegador, e não pelo Supabase Auth. | #25 |

## Depende de

Nenhuma. É a primeira história a ser implementada e cria a App Shell que as demais vão reaproveitar.

## Dúvidas em aberto

| # | Dúvida | Quem responde |
| --- | --- | --- |
