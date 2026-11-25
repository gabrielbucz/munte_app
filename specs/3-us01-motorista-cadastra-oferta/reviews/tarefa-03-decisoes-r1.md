# Decisões — Tarefa 3, rodada 1

| # | Apontamento (resumo) | Parecer | Decisão | Justificativa |
| --- | --- | --- | --- | --- |
| 1 | O teste "trocar de bairro desmarca o ponto" só olha o `value` do `<select>`, `aria-invalid` e a ausência de alerta; o `<select>` aparece vazio mesmo se o controle continuar com o ponto do bairro anterior, então o teste passaria sem a limpeza (`reset('')`) e não prova a 2ª parte do CA10 | conformidade | aceito | |
