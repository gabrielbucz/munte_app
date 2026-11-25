# Decisões — Tarefa 8, rodada 1

| # | Apontamento (resumo) | Parecer | Decisão | Justificativa |
| --- | --- | --- | --- | --- |
| 1 | A regra "status 0 = falha de rede" foi copiada em `ride-offer.service.ts:29-33` em vez de reaproveitar a de `auth.service.ts:107-110` | código | recusado | A correção exige alterar `auth.service.ts` e os testes da US12, fora dos arquivos previstos da Tarefa 8 (regra 3: não inchar o escopo). As duas cópias têm teste. Extrair a regra e a `FalhaDeRedeError` para `core/` vira Issue de manutenção. |
