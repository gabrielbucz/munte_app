# Decisões — Tarefa 10, rodada 1

Antes da revisão: o implementador estourou o limite de 2 rodadas de TDD nos dois testes do "voltar do navegador" (no TestBed o Router não reage a `Location.back()`). O usuário decidiu remover esses dois testes e conferir o voltar do navegador manualmente.

| # | Apontamento (resumo) | Parecer | Decisão | Justificativa |
| --- | --- | --- | --- | --- |
| 1 | Durante o "Publicando…", "Cancelar" (sem `[disabled]`) ou um link confirmam o descarte, mas a inscrição em `criar()` sobrevive ao componente: a oferta é gravada e o motorista é levado de Início para os detalhes dela | conformidade e código (mesmo defeito) | recusado | A premissa do CA6 é cadastro parcial; com o envio já pedido, o cadastro não está pela metade. A correção completa exige uma decisão de produto que a spec não tomou (o que fazer ao sair durante o envio). Vira Issue nova, junto com o `takeUntilDestroyed` (regra 3). |
| 2 | O trecho "pelo voltar do navegador" do CA6 ficou sem prova automatizada | conformidade | recusado | Os testes foram removidos por decisão do usuário após o estouro das 2 rodadas de TDD (o Router do TestBed não reage ao `Location.back()`). O código cobre o voltar pelo mesmo guard. O voltar será conferido no navegador, com o resultado registrado no PR. |
