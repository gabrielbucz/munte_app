# Comandos do Sistema (iniciam com `/`)

Este arquivo guarda todos os comandos do código que iniciam com `/`, extraídos do repositório `munte_app`.

## Comandos do Sistema UTF-SDD (`.agents/`)

| Comando | Descrição | Arquivo |
|---------|-----------|---------|
| `/utf-issue <n>` | Fluxo de implementação de uma Issue (Feature). Orquestra todo o ciclo SDD: entendimento, planejamento, execução, auditoria e PR. | `.agents/workflows/utf-issue.md` |
| `/utf-task <n>` | Executa UMA tarefa do `plan.md` com ciclo completo: tutor explica antes, implementador, dois revisores, máximo 2 rodadas de revisão. Sem número, resolve a próxima pendente. | `.agents/workflows/utf-task.md` |
| `/utf-tutor <arg>` | Despacha o agente tutor para explicar: tarefa feita (número), antes de implementar (`antes <n>`), spec em rascunho (`spec`), simulado pré-PR (`prova`), passo a passo (`passo <n>`), documentos (`prd`, `design`, `architecture`) ou scaffold (`setup`). | `.agents/workflows/utf-tutor.md` |
| `/utf-backlog` | Cria as Issues das stories no GitHub (pré-condição do fluxo utf-issue). | Referenciado em `utf-issue.md` |
| `/utf-architecture` | Explica o documento `docs/architecture.md` via tutor. | Referenciado em `utf-tutor.md` |
| `/utf-design` | Explica o documento `docs/design-tokens.md` via tutor. | Referenciado em `utf-tutor.md` |
| `/utf-prd` | Explica o documento `docs/prd.md` via tutor. | Referenciado em `utf-tutor.md` |
| `/utf-setup` | Explica o scaffold gerado: app, fonte de dados e configuração. | Referenciado em `utf-tutor.md` |

## Outros padrões com `/` encontrados nos docs (possíveis caminhos/rotas, não comandos do sistema)

- `/api`, `/app`, `/architecture`, `/prd`, `/plan`, `/spec`, `/tasks`, `/reviews`, `/web`, `/workflows`, `/src`, `/modelo-spec`, `/modelo-plan`, `/design-tokens`, `/guia-sdd`, `/checklist`, `/pull_request_template`, `/README`, `/CONTRIBUTING`, `/rules`, `/agents`, etc.

Esses últimos aparecem como partes de URLs, caminhos de arquivo ou referências na documentação, não como comandos executáveis do sistema UTF-SDD.

---

*Gerado automaticamente a partir da busca nos arquivos de `.agents/` e `docs/` do repositório `munte_app`.*