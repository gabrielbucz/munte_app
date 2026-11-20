---
issue: 8
status: aprovada   # rascunho | aprovada
---

# US12 — autenticação por e-mail institucional

## O problema

Usuários da comunidade UTFPR (alunos e servidores) precisam entrar no app de caronas para oferecer ou solicitar vagas, mas a autenticação ainda não está implementada em código. A US12 no PRD previa login via portal UTFApps (OAuth); o requisito mudou para autenticação por e-mail institucional com validação por link de confirmação, sem cadastro manual nem senha local.

## A história

**Como** usuário da comunidade UTFPR (aluno ou servidor), **eu quero** entrar com meu e-mail institucional (@utfpr.edu.br), **para que** meu vínculo seja verificado por link de confirmação, sem cadastro manual nem senha local.

## Critérios de aceite

- [x] **CA1 — Dado** informo um e-mail institucional @utfpr.edu.br, **quando** solicito acesso, **então** o sistema envia um link de confirmação por e-mail.
- [x] **CA2 — Dado** clico no link de confirmação recebido dentro do prazo de validade (1 hora), **quando** tento entrar, **então** o acesso libera com perfil (aluno/servidor) identificado e vínculo ativo.
- [x] **CA3 — Dado** uso um e-mail não institucional ou um link expirado/inválido, **quando** tento entrar, **então** exibe "e-mail não permitido ou link inválido" e bloqueia o acesso.

- [ ] **CA4 — Dado** que o usuário solicitou um link de confirmação e não o utilizou dentro do prazo de validade, **quando** tentar autenticar com esse link expirado, **então** o acesso será bloqueado e o usuário poderá solicitar um novo link.

- [ ] **CA5 — Dado** que a sessão de autenticação expirou, **quando** o usuário tentar acessar uma rota protegida, **então** deverá realizar uma nova autenticação por meio de um link de confirmação.

- [ ] **CA6 — Dado** que ocorre uma falha de rede durante o envio do e-mail de confirmação, **quando** o usuário solicitar acesso, **então** o sistema deverá informar o erro e permitir uma nova tentativa.

- [ ] **CA7 — Dado** que o usuário acessa uma tela da aplicação, **quando** a rota correspondente é apresentada, **então** o conteúdo da tela deve ser renderizado no palco central, entre o cabeçalho e o rodapé da App Shell.

- [ ] **CA8 — Dado** que a aplicação está em visualização mobile e a gaveta está fechada, **quando** o usuário toca no botão ☰, **então** a gaveta de navegação é aberta e apresenta o link da história.

- [ ] **CA9 — Dado** que a gaveta mobile está aberta, **quando** o usuário toca no link da história, **então** a gaveta é fechada e a tela correspondente à história é apresentada.

## Fora de escopo

- Cadastro manual de usuário com senha local.
- Login por provedores sociais ou portal UTFApps (OAuth).
- Recuperação de senha (não há senha local; o link de confirmação é o único fator).

## Abandono no meio

- O usuário fecha a aba depois de solicitar o link e antes de clicar nele: o link expira em 1 hora e pode ser reenviado mediante nova solicitação.
- A sessão do BaaS expira: o usuário precisa solicitar um novo link de confirmação para reentrar.
- A rede cai no envio do e-mail de confirmação: o sistema exibe erro e permite tentar novamente.

## Assume que

Nenhuma premissa identificada para esta história.

## Depende de

Nenhuma. Não há dependências de outras issues.

## Dúvidas em aberto

| # | Dúvida | Quem responde |
| --- | --- | --- |
