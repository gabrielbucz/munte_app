# 🎨 Tokens de Design

**Projeto:** munte-app  
**Versão:** 1.0.0  
**Tecnologia:** Tailwind CSS v4  
**Última atualização:** 2026-11-02

> 🤖 **Este documento existe para padronizar a identidade visual do projeto e impedir que a IA invente estilos diferentes a cada tela.**
>
> Não é um design system completo, mas estabelece os tokens visuais que devem ser respeitados durante o desenvolvimento.
>
> ✍️ Os valores visuais devem seguir este documento. Alterações nos tokens devem ser feitas de maneira consistente.

---

## Paleta de cores (Tailwind CSS v4)

As cores são definidas por variáveis CSS e registradas no `@theme` do Tailwind CSS v4, permitindo utilização por meio de classes utilitárias.

O modo escuro utiliza sobrescrita das variáveis CSS em `:root[data-theme="dark"]`.

| Token semântico | Variável CSS | Valor (Light) | Valor (Dark) | Papel |
|---|---|---|---|---|
| `primaria` | `--primaria` | `#0066CC` | `#3B82F6` | Ação principal, botões, links ativos |
| `primaria-hover` | `--primaria-hover` | `#0052A3` | `#60A5FA` | Hover/foco de botões primários |
| `superficie` | `--superficie` | `#FFFFFF` | `#1E293B` | Cards, modais, bottom sheets |
| `background` | `--background` | `#F8FAFC` | `#0F172A` | Fundo das telas |
| `texto` | `--texto` | `#0F172A` | `#F8FAFC` | Texto principal |
| `texto-suave` | `--texto-suave` | `#64748B` | `#94A3B8` | Legendas, apoio, timestamps |
| `borda` | `--borda` | `#E2E8F0` | `#334155` | Bordas, divisórias |
| `sucesso` | `--sucesso` | `#16A34A` | `#22C55E` | Confirmações, aceites, vagas |
| `sucesso-hover` | `--sucesso-hover` | `#15803D` | `#4ADE80` | Hover de ações de confirmação |
| `perigo` | `--perigo` | `#DC2626` | `#EF4444` | Cancelamento, recusa, erros |
| `perigo-hover` | `--perigo-hover` | `#B91C1C` | `#F87171` | Hover de exclusão/cancelamento |
| `alerta` | `--alerta` | `#D97706` | `#FBBF24` | Tolerância menor que 30 minutos, capacidade |
| `desabilitado` | `--desabilitado` | `#CBD5E1` | `#475569` | Fundo de controles inativos |
| `desabilitado-texto` | `--desabilitado-texto` | `#94A3B8` | `#64748B` | Rótulos desabilitados |

### Configuração no Tailwind CSS v4

Os tokens devem ser definidos no arquivo global `apps/web/src/styles.css`.

Exemplo de configuração:

```css
@import "tailwindcss";

/* Valores padrão: Light Mode */
:root {
  --primaria: #0066CC;
  --primaria-hover: #0052A3;
  --superficie: #FFFFFF;
  --background: #F8FAFC;
  --texto: #0F172A;
  --texto-suave: #64748B;
  --borda: #E2E8F0;
  --sucesso: #16A34A;
  --sucesso-hover: #15803D;
  --perigo: #DC2626;
  --perigo-hover: #B91C1C;
  --alerta: #D97706;
  --desabilitado: #CBD5E1;
  --desabilitado-texto: #94A3B8;
}

/* Dark Mode */
:root[data-theme="dark"] {
  --primaria: #3B82F6;
  --primaria-hover: #60A5FA;
  --superficie: #1E293B;
  --background: #0F172A;
  --texto: #F8FAFC;
  --texto-suave: #94A3B8;
  --borda: #334155;
  --sucesso: #22C55E;
  --sucesso-hover: #4ADE80;
  --perigo: #EF4444;
  --perigo-hover: #F87171;
  --alerta: #FBBF24;
  --desabilitado: #475569;
  --desabilitado-texto: #64748B;
}

/* Registro dos tokens no Tailwind */
@theme inline {
  --color-primaria: var(--primaria);
  --color-primaria-hover: var(--primaria-hover);
  --color-superficie: var(--superficie);
  --color-background: var(--background);
  --color-texto: var(--texto);
  --color-texto-suave: var(--texto-suave);
  --color-borda: var(--borda);
  --color-sucesso: var(--sucesso);
  --color-sucesso-hover: var(--sucesso-hover);
  --color-perigo: var(--perigo);
  --color-perigo-hover: var(--perigo-hover);
  --color-alerta: var(--alerta);
  --color-desabilitado: var(--desabilitado);
  --color-desabilitado-texto: var(--desabilitado-texto);
}
```

Exemplos de utilização:

```html
<div class="bg-background text-texto">
  <section class="bg-superficie border border-borda">
    <h1 class="text-texto">Munte app</h1>

    <button class="bg-primaria hover:bg-primaria-hover">
      Continuar
    </button>
  </section>
</div>
```

---

## Escala de espaçamento (base 4px)

O Tailwind CSS utiliza uma escala padrão de espaçamento baseada em incrementos de `0.25rem` (4px).

Os tokens semânticos abaixo representam os valores de espaçamento do projeto.

| Token | Valor (rem) | Valor (px) | Classe Tailwind equivalente |
|---|---|---|---|
| `xs` | `0.5rem` | 8px | `p-2`, `m-2`, `gap-2` |
| `sm` | `0.75rem` | 12px | `p-3`, `m-3`, `gap-3` |
| `md` | `1rem` | 16px | `p-4`, `m-4`, `gap-4` |
| `lg` | `1.5rem` | 24px | `p-6`, `m-6`, `gap-6` |
| `xl` | `2rem` | 32px | `p-8`, `m-8`, `gap-8` |
| `2xl` | `3rem` | 48px | `p-12`, `m-12`, `gap-12` |

Os espaçamentos devem manter consistência entre telas, cards, formulários, modais e componentes.

---

## Tipografia

**Família:**

`Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

| Token | Tamanho | Peso | Classe Tailwind / Uso |
|---|---|---|---|
| `display-md` | `1.875rem` (30px) | 700 | `text-3xl font-bold` — títulos grandes/boas-vindas |
| `heading-lg` | `1.5rem` (24px) | 600 | `text-2xl font-semibold` — títulos de cards/modais |
| `heading-md` | `1.25rem` (20px) | 600 | `text-xl font-semibold` — subtítulos/agrupamentos |
| `body` | `1rem` (16px) | 400 | `text-base font-normal` — texto padrão |
| `body-sm` | `0.875rem` (14px) | 400 | `text-sm font-normal` — textos secundários |
| `button` | `0.875rem` (14px) | 600 | `text-sm font-semibold` — rótulos de botões |
| `caption` | `0.75rem` (12px) | 500 | `text-xs font-medium` — chips, badges, metadados |

A família tipográfica deve ser aplicada globalmente, mantendo consistência em todas as telas.

---

## Estados de botão (Tailwind CSS)

| Estado | Aparência (classes/variáveis) |
|---|---|
| Normal | `bg-primaria text-white border border-primaria` |
| Hover | `hover:bg-primaria-hover hover:border-primaria-hover` |
| Foco (teclado) | `focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primaria/25` |
| Desabilitado | `disabled:bg-desabilitado disabled:text-desabilitado-texto disabled:opacity-65 disabled:cursor-not-allowed` |
| Carregando | Manter a aparência do botão e adicionar indicador visual de carregamento, com `animate-spin` quando aplicável |

As variantes de botões devem respeitar os tokens semânticos:

- Primário: `bg-primaria`
- Confirmação: `bg-sucesso`
- Cancelamento/erro: `bg-perigo`
- Desabilitado: `bg-desabilitado`

---

## Breakpoints (Mobile-First)

O projeto utiliza breakpoints próprios, diferentes dos valores padrão do Tailwind CSS.

Os valores devem ser registrados no `@theme` do Tailwind CSS v4.

| Token | Largura mínima | Classe Tailwind / uso |
|---|---|---|
| `sm` | 640px | `sm:` — smartphones em paisagem |
| `md` | 768px | `md:` — tablets em retrato |
| `lg` | 1024px | `lg:` — tablets em paisagem/laptops |
| `xl` | 1280px | `xl:` — desktops padrão |

Configuração:

```css
@theme {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

**Decisão:** utilizamos os valores definidos na especificação do projeto (640/768/1024/1280px), substituindo os breakpoints padrão do Tailwind quando necessário.

---

## Identidade PWA

Os valores abaixo alimentam o `manifest.webmanifest` no setup do projeto.

| Campo | Valor |
|---|---|
| Nome curto (`short_name`) | Munte-app |
| Cor de tema (`theme_color`) | `#0066CC` |
| Cor de fundo (`background_color`) | `#F8FAFC` |
| Ícone | `/icons/icon-192.png` (192×192) + `/icons/icon-512.png` (512×512) — gerados a partir da marca UTFPR |
| Modo de exibição (`display`) | `standalone` |
| Comportamento visual offline | Tela "Sem conexão" com ícone offline, mensagem "Você está offline. Suas caronas salvas estão disponíveis." + botão "Tentar novamente" |

---

## Protótipo

**Link (Stitch):** https://stitch.withgoogle.com/projects/18188893525436397761

**Link (Figma):** https://www.figma.com/design/sGZhxiiZS7xKHRMMemq12L/Munte-App?node-id=0-1&t=QfF1ECKpvhtbrU5r-1

### Telas (17 ativas — Mobile-First 375/390px, Tablet 768–1024px, Protótipo Interativo Unificado)

#### Mobile (8 telas — jornadas principais)

1. **Login / Autenticação UTFApps** — CAFe/RNP, selos, termos de gratuidade.
2. **Home / Dashboard** — Atalhos "Oferecer Carona" / "Buscar Carona", métricas, partidas do dia.
3. **Criar Oferta (Motorista)** — Wizard: Sentido → Bairro/Ponto → Horário/Vagas.
4. **Buscar Caronas (Passageiro)** — Filtros Ida/Volta, bairros homologados, cards com vagas.
5. **Detalhe da Oferta + Solicitação** — Bottom sheet: trajeto, recado, confirmação.
6. **Gestão de Solicitações (Motorista)** — Pendentes com Aceitar/Recusar, bloqueio de vagas esgotadas.
7. **Minhas Caronas Confirmadas** — Abas Ativas/Histórico, contatos pós-confirmação, cancelamento.
8. **Central de Notificações** — Linha do tempo: avisos, confirmações, lembretes.

#### Tablet (8 telas — layout adaptado 2 colunas / grid / painel lateral)

1. Login / Autenticação UTFApps (Tablet) — 2 colunas, boas-vindas institucionais.
2. Home / Dashboard (Tablet) — Nav superior, ações rápidas lado a lado, resumo por bairro.
3. Criar Oferta - Motorista (Tablet) — Wizard esquerda + resumo trajeto direita (tempo real).
4. Buscar Caronas - Passageiro (Tablet) — Grid caronas + filtros horizontais + selos.
5. Detalhe da Oferta + Solicitação (Tablet) — Itinerário completo + painel confirmação.
6. Gestão de Solicitações - Motorista (Tablet) — Recebidos + confirmados com contato.
7. Minhas Caronas Confirmadas (Tablet) — Ativas com contagem regressiva + segurança.
8. Central de Notificações (Tablet) — Cronológica + painel lateral detalhes.

#### Protótipo Interativo Unificado (Desktop)

- **Munte-app — Protótipo Interativo Completo** — Seletor superior das 8 telas + alternador desktop/mobile.

Todas as telas seguem a identidade visual institucional: azul `#0066CC`, tipografia Inter e tokens semânticos definidos neste documento.

---

## Diretrizes de utilização

- Utilizar exclusivamente Tailwind CSS v4 para estilização.
- Não adicionar Bootstrap ou classes `bs-*` ao projeto.
- Priorizar tokens semânticos em vez de valores de cores arbitrários.
- Utilizar as classes responsivas do Tailwind conforme os breakpoints definidos.
- Manter os valores de Light e Dark Mode sincronizados com a tabela de cores.
- Não criar novas cores, escalas de espaçamento ou padrões tipográficos sem atualizar este documento.
- Manter os componentes visuais consistentes entre as versões mobile, tablet e desktop.