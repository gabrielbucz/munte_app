# 📄 Product Requirements Document (PRD)

**Projeto:** Caronas UTFPR
**Versão:** 1.0.0 · rascunho via `/utf-prd` — aguarda leitura do aluno e commit dele
**Última atualização:** 2026-09-16

> 🤖 **Este documento é a fonte da verdade sobre o QUE o produto faz.** Regra de
> negócio que não estiver aqui não existe — nem para a equipe, nem para a IA.
> Tecnologia **não** se discute aqui: isso é assunto do `architecture.md`.

---

## 🎯 1. Visão Geral e Objetivo

**O problema:** alunos (e servidores) que precisam ir e voltar da faculdade têm dificuldade de se conectar com motoristas da comunidade que fazem rotas compatíveis.

**A solução:** app para conectar membros da comunidade UTFPR que oferecem carona (motoristas) com membros que precisam de carona (caronas/passageiros) até a faculdade, onde o ponto na faculdade é sempre o mesmo e o que muda é o ponto no bairro onde a pessoa é pega/deixada. O motorista informa ida e/ou volta com ponto de referência, horário e vagas; o carona busca por bairro e horário e solicita vaga; o motorista aceita ou recusa.

**Como saberemos que deu certo:** por meio da notificação do "match".

---

## 📖 2. Glossário Ubíquo

| Termo | Significa | Não confundir com |
| :---- | :-------- | :---------------- |
| Comunidade UTFPR / Usuário autenticado | estudante (graduação/pós) ou servidor (docente/TAE) com vínculo ativo validado via portal UTFApps | visitante sem vínculo |
| Motorista | membro autenticado da comunidade UTFPR que oferece carona em veículo próprio | carona |
| Carona | passageiro, membro autenticado da comunidade UTFPR que solicita carona | motorista |
| Ida | trajeto com destino à UTFPR | volta |
| Volta | trajeto com ponto de partida na UTFPR | ida |
| Ponto de referência | 1 dos 3 pontos fixos do bairro, escolhido no preenchimento do destino ou ponto de partida, pelo motorista e pelo carona | ponto na faculdade, que é sempre o mesmo |
| Vaga | quantidade definida pelo motorista | solicitação |
| Solicitação | pedido definido pelo carona | vaga |
| Match / Aceite | a mesma coisa, dependem da afirmativa do motorista | cancelamento |
| Cancelamento | desistência após o aceite, até 30min antes (entra no lugar da confirmação pré-horário) | match / aceite |

---

## 👤 3. Atores e Permissões

Condição geral: o acesso a qualquer funcionalidade exige vínculo ativo validado via portal UTFApps (RN14).

| Ator | Quem é | Pode | Não pode |
| :--- | :----- | :--- | :------- |
| Motorista | membro autenticado da comunidade UTFPR (aluno ou servidor) que disponibiliza vagas gratuitas em veículo próprio | informar só ida, só volta, os dois ou nada por enquanto; em cada trajeto definir ponto de referência, horário e vagas; aceitar ou recusar solicitação; cancelar avisando os caronas | exceder vagas; solicitar a própria viagem; alterar horário/ponto/rota com passageiro confirmado sem revalidar; ver contato do carona antes do aceite; aprovar após o horário de partida; apagar histórico de viagens concluídas; cobrar qualquer valor |
| Carona | membro autenticado da comunidade UTFPR (aluno ou servidor) que solicita vaga | filtrar por bairro e horário; ver quantos motoristas passam por ponto/horário; solicitar vaga (única se ida+volta mesmo ponto, separada se pontos diferentes); cancelar avisando o motorista | alterar detalhes definidos pelo motorista; envios duplicados ou reservas com horário sobreposto; gerenciar solicitações de outros caronas; avaliar antes do encerramento do trajeto; cancelar a poucos minutos da partida sem registro de desistência tardia para reputação; oferecer vagas sem cadastrar veículo e assumir papel de motorista |

Sem administrador neste PRD — administração vai para Fora de Escopo (US10 `Could` só se sobrar tempo).

---

## 📝 4. Escopo Funcional (User Stories)

Todas nascem `Draft` — **só o aluno promove a `Ready`**.

### US01 — motorista cadastra oferta · `Must Have` · `M` · Status: `Draft`

**Como** motorista da comunidade UTFPR, **eu quero** cadastrar uma oferta de carona voluntária especificando itinerário, horário e vagas disponíveis **para que** eu possa disponibilizar assentos livres e organizar os passageiros de forma centralizada e sem custos.

**Critérios de aceite:**

- [ ] **Dado** que informei trajeto (só ida ou só volta), ponto, horário futuro e vagas ≥1, **quando** confirmo a publicação, **então** a oferta fica "Disponível" com confirmação e entra nas minhas ativas.
- [ ] **Dado** que informei ida e volta com pontos/horários e vagas, **quando** confirmo, **então** criam-se dois trechos vinculados e independentes na busca.
- [ ] **Dado** que informei ponto dos fixos + observações (ex.: tolerância), **quando** publico, **então** ficam salvos e visíveis nos detalhes.
- [ ] **Dado** vagas 0/negativa, **quando** tento publicar, **então** bloqueia com "mínimo 1 vaga".
- [ ] **Dado** horário ou ponto vazio, **quando** tento publicar, **então** destaca "preenchimento obrigatório" e bloqueia.
- [ ] **Dado** horário no passado, **quando** tento publicar, **então** recusa com "precisa ser no futuro".
- [ ] **Dado** cadastro parcial, **quando** desisto e confirmo descarte, **então** nada é registrado.

**Regras relacionadas:** RN01, RN02, RN03, RN10, RN11

### US02 — busca e filtros · `Must Have` · `L` · Status: `Draft`

**Como** passageiro da comunidade UTFPR, **eu quero** filtrar as ofertas navegando por Ida e Volta, selecionando um dos 23 bairros para ver os 3 pontos fixos e horários, **para que** eu possa localizar motoristas da minha região e escolher pelo horário de aula.

**Critérios de aceite:**

- [ ] **Dado** bairro selecionado em Ida/Volta, **quando** filtro, **então** vejo só os 3 pontos dele com motoristas, horários e vagas.
- [ ] **Dado** bairro sem oferta em Ida/Volta, **quando** filtro, **então** vejo "Nenhuma carona encontrada" com atalho para limpar/alternar.

**Regras relacionadas:** RN01, RN02, RN04

### US03 — solicitação · `Must Have` · `M` · Status: `Draft`

**Como** passageiro da comunidade UTFPR, **eu quero** que o pedido de ida e volta vire uma única solicitação quando o ponto for o mesmo, ou separadas quando distintos, **para que** eu possa reservar o completo com um clique ou flexibilizar trechos avulsos.

**Critérios de aceite:**

- [ ] **Dado** ida+volta no mesmo ponto, **quando** solicito o completo, **então** gera uma única solicitação dos dois trechos e avisa o motorista.
- [ ] **Dado** só ida (ou pontos distintos), **quando** solicito o trecho, **então** registra pendente individual com status "Solicitação enviada".
- [ ] **Dado** vaga esgotada entre ver e solicitar, **quando** solicito, **então** invalida com "vagas acabaram de ser preenchidas" e marca "Esgotado".
- [ ] **Dado** pedido "Pendente", **quando** tento repetir, **então** mantém desabilitado como "Solicitação Enviada".
- [ ] **Dado** carona confirmada em horário sobreposto, **quando** solicito outra no mesmo horário, **então** bloqueia com "já possui carona neste horário".

**Regras relacionadas:** RN05, RN06

### US04 — gestão de aceites · `Must Have` · `S` · Status: `Draft`

**Como** motorista da comunidade UTFPR, **eu quero** ver e gerenciar solicitações pendentes, aceitando ou recusando cada pedido, **para que** eu possa controlar a ocupação e selecionar confirmados de forma simples e organizada.

**Critérios de aceite:**

- [ ] **Dado** solicitação de trecho único com vaga, **quando** aceito, **então** fica "Aceita", baixa 1 vaga e entra em Minhas Caronas.
- [ ] **Dado** pendente, **quando** recuso, **então** fica "Recusado" e a vaga segue livre.
- [ ] **Dado** unificada com vaga em ambos, **quando** aceito, **então** confirma os dois e baixa 1 da Ida + 1 da Volta.
- [ ] **Dado** pendente mas vagas zeradas por aceites anteriores, **quando** tento aceitar, **então** bloqueia com "sem vagas".
- [ ] **Dado** unificada com um trecho lotado, **quando** tento aceitar, **então** impede sem baixar vagas e avisa o trecho lotado.
- [ ] **Dado** pedido cancelado pelo passageiro antes da resposta, **quando** tento responder, **então** informa "cancelada pelo passageiro" e remove sem mexer nas vagas.

**Regras relacionadas:** RN06, RN12

### US05 — minhas caronas · `Must Have` · `S` · Status: `Draft`

**Como** usuário da comunidade UTFPR (motorista ou passageiro), **eu quero** ver em Minhas Caronas as confirmadas com detalhes e contato da outra parte, **para que** eu possa acompanhar agendamentos, conferir locais/horários e falar antes do embarque.

**Critérios de aceite:**

- [ ] **Dado** passageiro com aceite, **quando** abro Minhas Caronas, **então** vejo viagens por data/hora com trajeto (Ida/Volta, bairro, ponto fixo) e contato do motorista.
- [ ] **Dado** motorista com aceites, **quando** abro uma ativa, **então** vejo ocupadas/livres e nomes/contatos dos confirmados.
- [ ] **Dado** futuras e passadas, **quando** navego, **então** ativas separam-se do histórico e contato só nas futuras.
- [ ] **Dado** nada confirmado/aceito, **quando** abro, **então** vejo "sem caronas agendadas" com atalhos para oferecer/buscar.
- [ ] **Dado** viagem cancelada pela outra parte durante a visualização, **quando** atualizo, **então** oculta contato, avisa e move para canceladas.
- [ ] **Dado** viagem já realizada, **quando** abro o histórico, **então** contato fica oculto por privacidade, só resumo do trajeto.

**Regras relacionadas:** RN07, RN13

### US06 — sino · `Must Have` · `M` · Status: `Draft`

**Como** usuário da comunidade UTFPR (motorista ou passageiro), **eu quero** uma central interna (sino no topo), **para que** eu possa ver em tempo real novas solicitações e respostas sem navegar manualmente.

**Critérios de aceite:**

- [ ] **Dado** novo pedido de vaga, **quando** chega, **então** o sino marca não lida e mostra "nova solicitação de [passageiro] para [Ida/Volta]".
- [ ] **Dado** resposta do motorista, **quando** aceita/recusa, **então** o passageiro recebe "aceitou/recusou seu pedido" no sino.
- [ ] **Dado** item não lido, **quando** clico, **então** navega ao destino e marca lida, zerando o contador.
- [ ] **Dado** nada recente, **quando** abro, **então** vejo "sem novas notificações" sem badge.
- [ ] **Dado** pedido cancelado antes de abrir o alerta, **quando** clico, **então** avisa "não mais disponível, cancelada pelo passageiro" sem redirecionar.
- [ ] **Dado** sem internet, **quando** abro o sino, **então** vejo as salvas com "offline: exibindo salvas", sem tempo real.

**Regras relacionadas:** RN09

### US07 — cancelamento até 30min · `Should Have` · `M` · Status: `Draft`

**Como** usuário da comunidade UTFPR (motorista ou passageiro), **eu quero** cancelar confirmada até 30min antes da partida, **para que** eu possa sinalizar imprevistos de forma justa e automática, reabrindo vaga ou buscando alternativa a tempo.

**Critérios de aceite:**

- [ ] **Dado** confirmada futura a >30min, **quando** passageiro cancela, **então** libera 1 vaga e avisa o motorista.
- [ ] **Dado** oferta com confirmados a >30min, **quando** motorista cancela, **então** marca "Cancelada pelo Motorista", avisa todos e sai da busca.
- [ ] **Dado** oferta "Esgotada", **quando** um cancela no prazo, **então** volta a "Vagas Disponíveis".
- [ ] **Dado** <30min da partida, **quando** tento cancelar, **então** bloqueia com "não permitido a <30min" e indica contato direto.
- [ ] **Dado** horário já passado, **quando** tento cancelar, **então** sem botão, "em andamento ou concluída".
- [ ] **Dado** já cancelada pela outra parte, **quando** tento cancelar, **então** rejeita com "já cancelada pela outra parte" sem mexer em vagas.

**Regras relacionadas:** RN08

### US08 — push nativa · `Should Have` · `L` · Status: `Draft`

Pop-up do dispositivo para avisos e respostas rápidas fora do app. Cabeçalho registrado — detalhar Dado/Quando/Então se entrar.

### US09 — atalho WhatsApp · `Could Have` · `S` · Status: `Draft`

Botão para abrir conversa com motorista/carona, exibido apenas após o aceite. Cabeçalho registrado — detalhar se entrar.

### US10 — painel admin · `Could Have` · `M` · Status: `Draft`

Moderação para gerenciar locais fixos e ver métricas. Entra só se sobrar tempo; hoje admin está fora de escopo.

### US11 — métricas acadêmicas · `Could Have` · `S` · Status: `Draft`

Contador de viagens voluntárias e estimativa de impacto no campus. Cabeçalho registrado — detalhar se entrar.

### US12 — autenticação via portal UTFApps · `Must Have` · `S` · Status: `Draft`

**Como** usuário da comunidade UTFPR (aluno ou servidor), **eu quero** entrar com minhas credenciais do portal UTFApps, **para que** meu vínculo seja verificado sem criar cadastro manual.

**Critérios de aceite:**

- [ ] **Dado** credenciais válidas do UTFApps, **quando** autentico, **então** o acesso libera com perfil (aluno/servidor) identificado.
- [ ] **Dado** credenciais inválidas ou vínculo inativo, **quando** tento entrar, **então** exibe "credenciais inválidas ou vínculo inativo" e bloqueia.

**Regras relacionadas:** RN14

---

## 🛡️ 5. Regras de Negócio (Constraints)

| ID | Regra | Stories |
| :-- | :---- | :------ |
| RN01 | Ponto na faculdade sempre o mesmo; no bairro vale 1 dos 3 pontos fixos; sem ponto personalizado, sem GPS | US01, US02 |
| RN02 | 23 bairros com 3 pontos fixos cada | US02 |
| RN03 | Motorista informa só ida, só volta, ambos ou depois; cada trajeto com ponto/horário/vagas; pergunta do outro (mesmo/outro/depois); perfil auto | US01 |
| RN04 | Carona filtra por bairro/horário e vê motoristas por ponto/horário | US02 |
| RN05 | Solicitação unificada se mesmo ponto, separada se distintos; sem duplicada, sem horário sobreposto, sem solicitar a própria | US03 |
| RN06 | Match = aceite do motorista; baixa vaga(s), unificada baixa Ida+Volta e exige vaga nos dois; zero bloqueia | US03, US04 |
| RN07 | Contato só após aceite, oculto antes e após conclusão; ativas separadas do histórico; WhatsApp só após aceite | US05, US09 |
| RN08 | Cancelamento até 30min antes por ambos; <30min bloqueia e indica contato direto; solicitação a <30min não cancela; motorista cancela avisa todos e sai da busca; passageiro cancela reabre vaga | US07 |
| RN09 | Sino avisa nova solicitação e resposta; clique navega e marca lida; item cancelado avisa sem redirecionar | US06, US08 |
| RN10 | Voluntário 100% sem custo; pagamentos fora de escopo | US01 |
| RN11 | Vaga ≥1, horário futuro, ponto/horário obrigatórios; abandono descarta sem registrar | US01 |
| RN12 | Sem alterar horário/ponto/rota com confirmado sem revalidar; sem aprovar após partida; sem apagar histórico | US04 |
| RN13 | Sem avaliar antes do encerramento; desistência tardia registrada para reputação; oferecer exige veículo + papel motorista | US05 |
| RN14 | Autenticação delegada ao UTFApps; sem cadastro manual e sem senha local; só vínculo ativo entra | US12 |

---

## 🚫 6. Fora de Escopo (Non-goals)

- Pagamentos/taxas — voluntário 100% sem custo.
- GPS em tempo real — foco em rotas e pontos estáticos.
- Pontos personalizados — valem só os 3 fixos por bairro.
- Administração/moderação — fora agora (US10 `Could` só se sobrar tempo).

---

## ⚙️ 7. Requisitos Não Funcionais (Qualidade)

| ID | Requisito |
| :-- | :-------- |
| RNF01 | Privacidade: contato oculto até o aceite |
| RNF02 | Sino em tempo real em até 3s em primeiro plano |
| RNF03 | Offline: ver Minhas Caronas e últimas notificações sem internet |
| RNF04 | Busca em até 3 toques da inicial |
| RNF05 | Lista em até 2s em 3G/4G |

Detalhe de implementação (Service Workers, tempos, canais) fica para o `architecture.md` — aqui vale o compromisso justificável na defesa.

---

## 🛠️ 8. Histórico

| Data | Versão | O que mudou |
| :--- | :----- | :---------- |
| 2026-09-16 | 1.0.0 | Versão inicial via `/utf-prd` (rascunho, aguarda leitura e commit do aluno) |

---

## ❓ Dúvidas em aberto

- US08–US11 estão só cabeçalho — detalhar Dado/Quando/Então somente se entrarem no escopo.
- Fonte/validade dos 23 bairros e dos 3 pontos por bairro (lista oficial?) — confirmar antes do `/utf-backlog`.
