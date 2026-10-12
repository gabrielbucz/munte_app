# 🎨 Tokens de Design

**Projeto:** Caronas UTFPR
**Versão:** 1.0.0 · definido via `/utf-design`
**Última atualização:** 2026-10-11

> 🤖 **Este documento existe para a IA parar de inventar um botão diferente a cada
> tela.** Não é um design system — é o mínimo que dá à prototipagem assistida algo a
> que obedecer.
>
> ✍️ **Não preencha na mão:** rode `/utf-design`.

---

## Paleta (Bootstrap — variáveis CSS)

Valores baseados no spec (light mode). Dark mode via sobrescrita de variáveis CSS no `:root[data-bs-theme="dark"]`.

| Token (semântico) | Variável Bootstrap | Valor (Light) | Valor (Dark) | Papel |
| --- | --- | --- | --- | --- |
| `primaria` | `--bs-primary` | `#0066CC` | `#3B82F6` | ação principal, botões, links ativos |
| `primaria-hover` | `--bs-primary-hover` | `#0052A3` | `#60A5FA` | hover/foco de botões primários |
| `superficie` | `--bs-surface` | `#FFFFFF` | `#1E293B` | cards, modais, bottom sheets |
| `background` | `--bs-body-bg` | `#F8FAFC` | `#0F172A` | fundo das telas |
| `texto` | `--bs-body-color` | `#0F172A` | `#F8FAFC` | texto principal |
| `texto-suave` | `--bs-text-muted` | `#64748B` | `#94A3B8` | legendas, apoio, timestamps |
| `borda` | `--bs-border-color` | `#E2E8F0` | `#334155` | bordas, divisórias |
| `sucesso` | `--bs-success` | `#16A34A` | `#22C55E` | confirmações, aceites, vagas |
| `sucesso-hover` | `--bs-success-hover` | `#15803D` | `#4ADE80` | hover de ações de confirmação |
| `perigo` | `--bs-danger` | `#DC2626` | `#EF4444` | cancelamento, recusa, erros |
| `perigo-hover` | `--bs-danger-hover` | `#B91C1C` | `#F87171` | hover de exclusão/cancelamento |
| `alerta` | `--bs-warning` | `#D97706` | `#FBBF24` | tolerância <30min, capacidade |
| `desabilitado` | `--bs-disabled-bg` | `#CBD5E1` | `#475569` | fundo de controles inativos |
| `desabilitado-texto` | `--bs-disabled-color` | `#94A3B8` | `#64748B` | rótulos desabilitados |

## Escala de espaçamento (base 4px — mapeada para Bootstrap)

Bootstrap usa multiplicadores de `1rem` (16px). Valores equivalentes:

| Token | Valor (rem) | Valor (px) | Classe Bootstrap |
| --- | --- | --- | --- |
| `xs` | `0.5rem` | 8px | `.p-1`, `.m-1`, `.gap-1` |
| `sm` | `0.75rem` | 12px | `.p-2`, `.m-2`, `.gap-2` |
| `md` | `1rem` | 16px | `.p-3`, `.m-3`, `.gap-3` |
| `lg` | `1.5rem` | 24px | `.p-4`, `.m-4`, `.gap-4` |
| `xl` | `2rem` | 32px | `.p-5`, `.m-5`, `.gap-5` |
| `2xl` | `3rem` | 48px | custom (ex.: `style="padding: 3rem"`) |

## Tipografia

Família: `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

| Token | Tamanho | Peso | Classe Bootstrap / Uso |
| --- | --- | --- | --- |
| `display-md` | `1.875rem` (30px) | 700 | `.display-5` custom — títulos grandes/boas-vindas |
| `heading-lg` | `1.5rem` (24px) | 600 | `.h3` custom — títulos de cards/modais |
| `heading-md` | `1.25rem` (20px) | 600 | `.h4` custom — subtítulos/agrupamentos |
| `body` | `1rem` (16px) | 400 | `.fs-5` / padrão — texto padrão |
| `body-sm` | `0.875rem` (14px) | 400 | `.fs-6` — textos secundários |
| `button` | `0.875rem` (14px) | 600 | `.btn` — rótulos de botões |
| `caption` | `0.75rem` (12px) | 500 | `.small` custom — chips, badges, metadados |

## Estados de botão (Bootstrap)

| Estado | Aparência (classes/ variáveis) |
| --- | --- |
| normal | `.btn-primary` → `bg: var(--bs-primary)`, `color: white`, `border: var(--bs-primary)` |
| hover | `.btn-primary:hover` → `bg: var(--bs-primary-hover)`, `border: var(--bs-primary-hover)` |
| foco (teclado) | `.btn-primary:focus` → `box-shadow: 0 0 0 0.25rem rgba(0,102,204,.25)` (light) / `rgba(59,130,246,.25)` (dark) |
| desabilitado | `.btn-primary:disabled` → `bg: var(--bs-disabled-bg)`, `color: var(--bs-disabled-color)`, `opacity: 0.65` |
| carregando | `.btn-primary.disabled` + `.spinner-border.spinner-border-sm` (mantém cor, adiciona spinner) |

## Breakpoints (Mobile-First) — valores próprios do app (diferem do Bootstrap 5)

| Token | Largura mínima | Classe/uso |
| --- | --- | --- |
| `sm` | 640px | `@media (min-width: 640px)` — smartphones paisagem |
| `md` | 768px | `@media (min-width: 768px)` — tablets retrato |
| `lg` | 1024px | `@media (min-width: 1024px)` — tablets paisagem / laptops |
| `xl` | 1280px | `@media (min-width: 1280px)` — desktops padrão |

Bootstrap 5 padrão: `sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1400px`.
**Decisão:** usamos os valores do spec (640/768/1024/1280) via CSS customizado — não altera variáveis globais do Bootstrap, só media queries do app.

## Identidade PWA

Os valores abaixo alimentam o `manifest.webmanifest` no `/utf-setup` (ID3).

| Campo | Valor |
| --- | --- |
| Nome curto (`short_name`) | Caronas UTFPR |
| Cor de tema (`theme_color`) | `#0066CC` |
| Cor de fundo (`background_color`) | `#F8FAFC` |
| Ícone | `/icons/icon-192.png` (192×192) + `/icons/icon-512.png` (512×512) — gerados a partir da marca UTFPR |
| Modo de exibição (`display`) | `standalone` |
| Comportamento visual offline | Tela "Sem conexão" com ícone offline, mensagem "Você está offline. Suas caronas salvas estão disponíveis." + botão "Tentar novamente" |

## Protótipo

**Link (Stitch):** https://stitch.withgoogle.com/projects/18188893525436397761
**Link (Figma):** https://www.figma.com/design/sGZhxiiZS7xKHRMMemq12L/Munte-App?node-id=0-1&t=QfF1ECKpvhtbrU5r-1

**Telas (17 ativas — Mobile-First 375/390px, Tablet 768–1024px, Protótipo Interativo Unificado):**

### Mobile (8 telas — jornadas principais)
1. **Login / Autenticação UTFApps** — CAFe/RNP, selos, termos de gratuidade
2. **Home / Dashboard** — Atalhos "Oferecer Carona" / "Buscar Carona", métricas, partidas do dia
3. **Criar Oferta (Motorista)** — Wizard: Sentido → Bairro/Ponto → Horário/Vagas
4. **Buscar Caronas (Passageiro)** — Filtros Ida/Volta, bairros homologados, cards com vagas
5. **Detalhe da Oferta + Solicitação** — Bottom sheet: trajeto, recado, confirmação
6. **Gestão de Solicitações (Motorista)** — Pendentes com Aceitar/Recusar, bloqueio vagas esgotadas
7. **Minhas Caronas Confirmadas** — Abas Ativas/Histórico, contatos pós-confirmação, cancelamento
8. **Central de Notificações** — Linha do tempo: avisos, confirmações, lembretes

### Tablet (8 telas — layout adaptado 2 colunas / grid / painel lateral)
1. Login / Autenticação UTFApps (Tablet) — 2 colunas, boas-vindas institucionais
2. Home / Dashboard (Tablet) — Nav superior, ações rápidas lado a lado, resumo por bairro
3. Criar Oferta - Motorista (Tablet) — Wizard esquerda + resumo trajeto direita (tempo real)
4. Buscar Caronas - Passageiro (Tablet) — Grid caronas + filtros horizontais + selos
5. Detalhe da Oferta + Solicitação (Tablet) — Itinerário completo + painel confirmação
6. Gestão de Solicitações - Motorista (Tablet) — Recebidos + confirmados com contato
7. Minhas Caronas Confirmadas (Tablet) — Ativas com contagem regressiva + segurança
8. Central de Notificações (Tablet) — Cronológica + painel lateral detalhes

### Protótipo Interativo Unificado (Desktop)
- **Caronas UTFPR — Protótipo Interativo Completo** — Seletor superior das 8 telas + alternador desktop/mobile

Todas as telas seguem o Design System institucional (#0066CC, Inter, tokens semânticos).