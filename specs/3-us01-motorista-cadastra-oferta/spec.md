---
issue: 3
status: aprovada   # rascunho | aprovada
---

# US01 — motorista cadastra oferta

## O problema

O motorista que tem lugar sobrando no carro não tem onde anunciar a carona: depois da US12 o aluno consegue entrar no app, mas não há nenhuma tela para criar uma oferta, e sem oferta as demais histórias (busca, solicitação, aceite) não têm o que mostrar. A oferta precisa nascer certa — com ponto fixo do bairro, horário que ainda vai acontecer e vagas que fazem sentido —, porque é ela que o carona vai encontrar e solicitar.

## A história

**Como** motorista da comunidade UTFPR, **eu quero** cadastrar uma oferta de carona voluntária especificando itinerário, horário e vagas disponíveis **para que** eu possa disponibilizar assentos livres e organizar os passageiros de forma centralizada e sem custos.

## Critérios de aceite

> CA1 a CA6 são os critérios da US01 no `docs/prd.md` (1.4.0), na mesma ordem e com o mesmo texto. CA7 em diante são decisões da equipe que completam a história (caminhos tristes do envio e limites que o PRD não fixa).

- [ ] **CA1 — Dado** que informei trajeto (só ida ou só volta), ponto, horário futuro e vagas ≥1, **quando** confirmo a publicação, **então** a oferta fica "Disponível" com confirmação e entra nas minhas ativas.
  - *Decisão da equipe:* a confirmação é levar o motorista à tela da oferta criada (`/ofertas/<id>`), com o aviso "Oferta publicada." e os dados da oferta. "Entra nas minhas ativas" quer dizer que a oferta é gravada com o status "Disponível" e com o motorista que a criou; a **lista** de ofertas ativas é da US05 (#5).
- [ ] **CA2 — Dado** que informei ponto dos fixos + observações (ex.: tolerância), **quando** publico, **então** ficam salvos e visíveis nos detalhes.
  - *Decisão da equipe:* "os detalhes" são a tela da oferta criada (`/ofertas/<id>`), que mostra sentido (Ida ou Volta), bairro, ponto, horário, vagas e observações. Observações são opcionais.
- [ ] **CA3 — Dado** vagas 0/negativa, **quando** tento publicar, **então** bloqueia com "mínimo 1 vaga".
- [ ] **CA4 — Dado** horário ou ponto vazio, **quando** tento publicar, **então** destaca "preenchimento obrigatório" e bloqueia.
  - *Decisão da equipe:* vale para todos os campos obrigatórios — sentido, bairro, ponto, horário e vagas. Só observações é opcional.
- [ ] **CA5 — Dado** horário no passado, **quando** tento publicar, **então** recusa com "precisa ser no futuro".
  - *Decisão da equipe:* "futuro" é qualquer instante depois de agora; não há antecedência mínima nem prazo máximo nesta história.
- [ ] **CA6 — Dado** cadastro parcial, **quando** desisto e confirmo descarte, **então** nada é registrado.
  - *Decisão da equipe:* desistir é tocar em "Cancelar" ou sair da tela por um link ou pelo voltar do navegador com o formulário já alterado. Nos dois casos aparece a confirmação "Descartar esta oferta? O que você preencheu será perdido." Confirmando, nada é gravado e o motorista vai para a tela Início; recusando, ele continua no formulário com o que já tinha preenchido. Com o formulário intocado, sair não pede confirmação.
- [ ] **CA7 — Dado** vagas acima de 4, **quando** tento publicar, **então** bloqueia com "máximo 4 vagas".
  - *Decisão da equipe:* 4 porque um carro de passeio tem 5 lugares, e um deles é do motorista.
- [ ] **CA8 — Dado** observações com mais de 200 caracteres, **quando** tento publicar, **então** bloqueia com "máximo 200 caracteres".
  - *Decisão da equipe:* observações servem para recados curtos (ex.: tolerância de espera); 200 caracteres cabem na tela do celular sem rolagem.
- [ ] **CA9 — Dado** o formulário recém-aberto, **quando** ainda não toquei em nenhum campo, **então** nenhuma mensagem de erro aparece; a mensagem de um campo aparece quando saio dele com valor inválido, e o botão "Publicar" fica desligado enquanto houver qualquer campo inválido.
  - *Decisão da equipe:* com o botão desligado, "tentar publicar" nos CA3, CA4, CA5, CA7 e CA8 significa sair do campo com o valor inválido — é aí que a mensagem aparece e o bloqueio se vê.
- [ ] **CA10 — Dado** que escolhi um bairro, **quando** abro o campo ponto, **então** vejo só os 3 pontos fixos daquele bairro; se troco de bairro, o ponto escolhido antes é desmarcado.
- [ ] **CA11 — Dado** que o servidor não responde, **quando** confirmo a publicação, **então** aparece "Não foi possível publicar a oferta. Verifique sua conexão e tente novamente.", o que preenchi continua no formulário e posso tocar em "Tentar novamente".
- [ ] **CA12 — Dado** que toquei em "Publicar", **quando** o envio ainda está em andamento, **então** o botão fica desligado com o texto "Publicando…", e um segundo toque não cria uma segunda oferta.
- [ ] **CA13 — Dado** que não entrei no app (sem sessão), **quando** abro o formulário de nova oferta, **então** sou levado à tela Entrar.
  - *Decisão da equipe:* o motorista da oferta é o aluno que entrou (o e-mail da sessão da US12); por isso a tela é protegida pelo mesmo guard da tela Início.
- [ ] **CA14 — Dado** um endereço de oferta que não existe (`/ofertas/<id>` com id desconhecido), **quando** abro a tela, **então** vejo "Oferta não encontrada." com um link para a tela Início.
- [ ] **CA15 — Dado** que entrei no app, **quando** olho a navegação (barra superior no desktop, gaveta no mobile), **então** vejo o link "Oferecer carona", que abre o formulário de nova oferta.

## Fora de escopo

- Ida e volta na mesma oferta, "Repetir oferta habitual", pré-preenchimento por turno e bloqueio de motorista sem veículo homologado — US14 (`Draft` no PRD).
- Veículo da oferta (placa, modelo): a US01 não pede veículo; ele entra com a US14.
- A lista "minhas ofertas ativas" — US05 (#5).
- Editar ou cancelar uma oferta publicada — US07 (#6).
- Buscar e solicitar ofertas — US02 (#4) e US03 (#10).
- Antecedência mínima ou prazo máximo para o horário (CA5 aceita qualquer instante futuro).
- Aviso ao fechar a aba do navegador: fechar a aba descarta o que foi preenchido sem perguntar, e nada é gravado.
- Tempo limite (timeout) próprio para o envio: só a falha que o navegador reporta (servidor fora do ar) é tratada no CA11.
- A lista real dos 23 bairros e seus pontos — #35 (ver "Assume que").
- Aparência (layout mobile × desktop, fidelidade ao protótipo): conferida manualmente no navegador, com prints no PR, e não por teste automatizado.

## Abandono no meio

- **O motorista desiste no meio do preenchimento.** Pode tocar em "Cancelar" ou sair por um link/voltar do navegador. Como o formulário já tem dados, o app pergunta antes de descartar; confirmando, nada é gravado; recusando, nada se perde (CA6).
- **O motorista fecha a aba com o formulário pela metade.** Nada foi enviado, então nada é registrado — é o descarte do CA6 sem a pergunta (o aviso do navegador ficou fora de escopo).
- **O servidor cai (ou o json-server está parado) na hora de publicar.** O app avisa, mantém o que foi digitado e permite tentar de novo sem redigitar (CA11).
- **O motorista toca duas vezes em "Publicar" com a rede lenta.** O botão desliga durante o envio, e só uma oferta é criada (CA12).
- **O motorista abre um endereço de oferta inválido ou de uma oferta que não existe mais.** A tela avisa "Oferta não encontrada." em vez de ficar vazia (CA14).
- **A sessão expira no meio do preenchimento.** Fora desta história — é a US13 (#23).

## Assume que

| Premissa | Issue que fecha |
| --- | --- |
| As ofertas, os bairros e os pontos de referência ficam no json-server (`apps/api/db.json`), e não no Supabase. | #25 |
| Os bairros e pontos são **de exemplo** (3 bairros com 3 pontos cada, e um ponto na faculdade com nome provisório), e não os 23 bairros reais da RN02. | #35 |
| O motorista da oferta é identificado pelo e-mail da sessão simulada da US12, e não por um usuário do Supabase Auth. | #25 |

## Depende de

- US12 (#8) — já na `develop`: a sessão (o e-mail do motorista), o `authGuard` e a casca de navegação onde entra o link "Oferecer carona".

## Dúvidas em aberto

| # | Dúvida | Quem responde |
| --- | --- | --- |
