# Arquitetura - Lille Finance Dashboard

## Visao Geral

```
Google Sheets (fonte) --> Next.js API (CSV fetch) --> Dashboard (React)
                              |
                        Cache ISR 24h
                              |
                        Vercel (deploy)
```

## Fluxo de Dados

1. **Build/Revalidate**: Next.js faz fetch das 3 abas via endpoint CSV publico do Google Sheets
2. **Parse**: PapaParse converte CSV em arrays tipados
3. **Enriquecimento**: Plano de Contas e cruzado para classificar Entrada/Saida
4. **Status**: Campo `data_pgto` define se e Realizado ou Pendente
5. **Cache**: ISR com revalidate de 86400s (24h) armazena o resultado
6. **Client**: DashboardClient recebe dados e aplica filtros em tempo real (client-side)
7. **Refresh**: Botao POST /api/refresh invalida o cache e forca novo fetch

## Estrutura de Arquivos

```
src/
  app/
    page.tsx              # Dashboard principal (server -> DashboardClient)
    layout.tsx            # Layout com Sidebar
    api/refresh/route.ts  # Endpoint de revalidacao manual
    movimentacoes/
      page.tsx            # Tabela completa de movimentacoes
    mensal/
      page.tsx            # Grid de meses
      [slug]/page.tsx     # Drill-down por mes
    contas/
      page.tsx            # Detalhes das contas bancarias
  components/
    Sidebar.tsx           # Navegacao lateral
    FilterBar.tsx         # Filtros globais (ano, mes, categoria, tipo, status)
    DashboardClient.tsx   # Orquestrador client-side com estado de filtros
    KpiCard.tsx           # Card de indicador
    FluxoChart.tsx        # Grafico de barras (Recharts)
    CategoriasChart.tsx   # Grafico pizza (Recharts)
    SaldosBanco.tsx       # Cards de saldo
    TabelaMovimentacoes.tsx # Tabela com busca, filtros e paginacao
    RefreshButton.tsx     # Botao de atualizacao manual
  lib/
    types.ts              # Tipos TypeScript
    sheets.ts             # Fetch e parse do Google Sheets
    analytics.ts          # Calculos, formatacao, utilitarios
docs/
    REGRAS-DE-NEGOCIO.md  # Regras de negocio completas
    PREMISSAS.md          # Premissas e limitacoes
    ARQUITETURA.md        # Este arquivo
```

## Decisoes Tecnicas

| Decisao | Alternativa | Motivo |
|---|---|---|
| CSV via gviz endpoint | Google Sheets API v4 | Planilha publica, sem necessidade de API key |
| ISR 24h | SSR a cada request | Dados nao mudam frequentemente, performance |
| Client-side filtering | Server-side filtering | Filtros instantaneos sem round-trip, dados cabem em memoria |
| PapaParse | Manual split | Robusto com edge cases de CSV (aspas, virgulas em valores) |
| Recharts | Chart.js, D3 | API declarativa, boa integracao com React, SSR-friendly |
| Vercel | Netlify, AWS | Integracao nativa com Next.js, deploy por push |
