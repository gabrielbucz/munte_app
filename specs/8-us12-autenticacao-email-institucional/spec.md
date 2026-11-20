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

## Fora de escopo

- Cadastro manual de usuário com senha local.
- Login por provedores sociais ou portal UTFApps (OAuth).
- Recuperação de senha (não há senha local; o link de confirmação é o único fator).

## Abandono no meio

- O usuário fecha a aba depois de solicitar o link e antes de clicar nele: o link expira em 1 hora e pode ser reenviado mediante nova solicitação.
- A sessão do BaaS expira: o usuário precisa solicitar um novo link de confirmação para reentrar.
- A rede cai no envio do e-mail de confirmação: o sistema exibe erro e permite tentar novamente.

## Assume que

| Premissa | Issue que fecha |
| --- | --- |
| A fonte de dados para autenticação é o Supabase (BaaS, Entrega 3), não o json-server do MVP | — |
| O provedor de envio de e-mail (SMTP/Resend) está configurado e disponível | — |

## Depende de

Nenhuma. Não há dependências de outras issues.

## Dúvidas em aberto

| # | Dúvida | Quem responde |
| --- | --- | --- |
