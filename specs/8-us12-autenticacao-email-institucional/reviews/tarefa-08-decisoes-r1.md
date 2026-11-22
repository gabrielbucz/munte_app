# Decisões — Tarefa 8, rodada 1

| # | Apontamento (resumo) | Parecer | Decisão | Justificativa |
| --- | --- | --- | --- | --- |
| 1 | `auth.guard.spec.ts` monta o AuthService real e cria a sessão gravando direto no `localStorage` com a chave privada `'munte.sessao'`; o teste do guard fica acoplado ao mecanismo de armazenamento do service (fere `architecture.md` §2 e §8) e quebra na #25 sem o guard mudar | código | aceito | |
