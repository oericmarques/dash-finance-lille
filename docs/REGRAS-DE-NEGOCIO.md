# Regras de Negocio - Lille Finance Dashboard

## 1. Fonte de Dados

| Item | Detalhe |
|---|---|
| Origem | Google Sheets (planilha publica) |
| ID da planilha | `1476Ok5dUg6XZgwBiL2Om1I3WHzxSkVq6LEtabyMOy_w` |
| Metodo de acesso | CSV via endpoint `gviz/tq` (sem autenticacao) |
| Frequencia de sync | 1x ao dia (revalidate 86400s) + botao manual |

### Abas utilizadas

| Aba | Funcao | Uso no dashboard |
|---|---|---|
| `Plano_Contas` | Tabela de classificacao dos IDs | Referencia para determinar se movimento e Entrada ou Saida |
| `fMovimentacoes` | Todas as transacoes financeiras | **Fonte principal** de dados |
| `Saldo Banco` | Posicao das contas bancarias | Cards de saldo e tela de contas |

### Abas NAO utilizadas

| Aba | Motivo |
|---|---|
| `Pagamentos` | Dados duplicados/desatualizados. Tudo relevante esta em fMovimentacoes |
| `Externos` | Mesma estrutura do Plano_Contas (redundante) |
| `Recorrencias` | Dados de contratos recorrentes (complementar, nao usado nos calculos) |
| `aplicacao` | Sem dados relevantes para o dashboard |
| `PLR 2023` / `PLR 2024` | Historico de participacao nos lucros (nao usado) |

## 2. Classificacao de Movimentacoes

### Plano de Contas (IDs)

| ID | Movimento | Lancamento | Conta | Tipo |
|---|---|---|---|---|
| RB11 | Entrada | Receita | Operacional | Receita |
| RB12 | Entrada | Receita | Nao Operacional | Receita |
| RB13 | Entrada | Receita | Nao Tributavel | Receita |
| PG21 | Saida | Custo | Operacional | Fixo |
| PG22 | Saida | Custo | Operacional | Variavel |
| PG31 | Saida | Despesa | Operacional | Fixo |
| PG32 | Saida | Despesa | Operacional | Variavel |
| PG33 | Saida | Despesa | Nao Operacional | Fixo |
| PG34 | Saida | Despesa | Nao Tributavel | Variavel |

### Regra de classificacao
- IDs que comecam com **RB** = Entrada (Receita)
- IDs que comecam com **PG** = Saida (Custo ou Despesa)
- A classificacao vem da coluna `plano_contas_ID` cruzada com a tabela Plano_Contas

## 3. Colunas de Data (REGRA CRITICA)

| Coluna | Campo | Significado |
|---|---|---|
| `data` | Data de vencimento | Quando o valor deveria ser pago/recebido |
| `data_pgto` | Data de pagamento | Quando o valor FOI efetivamente pago/recebido |

### Status da movimentacao

| Condicao | Status | Significado |
|---|---|---|
| `data_pgto` preenchida | **Realizado** | Valor ja foi pago ou recebido |
| `data_pgto` vazia | **Pendente** | Valor a receber ou a pagar (projetado) |

### Dados futuros
- Movimentacoes com `data` no futuro sao validas
- Representam compromissos (a pagar) ou previsoes (a receber)
- O filtro de status permite ver somente realizados ou somente pendentes
- NAO filtrar ou esconder dados futuros automaticamente

## 4. Coluna MES

- Formato: `mmm.aa` (ex: `mai.26`, `jan.23`)
- Representa o mes de competencia da movimentacao
- Usado como eixo principal de agrupamento no dashboard
- Ordenacao: ano * 100 + numero do mes (jan=1, dez=12)

## 5. Contas Bancarias

| Conta | Descricao |
|---|---|
| BANCO C6 | Conta corrente principal |
| BANCO CONTA GLOBAL | Conta secundaria |
| ASAAS | Gateway de pagamentos |
| INVESTIMENTO | Reserva/aplicacoes |

- Saldos vem da aba `Saldo Banco`
- Total consolidado = soma de todas as contas
- Campo `ULTIMA ATUALIZACAO` indica quando o saldo foi conferido

## 6. Categorias

Categorias sao definidas na coluna `categoria` de fMovimentacoes. Principais:

**Entradas:** Consultoria, Projetos e Consultoria, Cursos, Marketing, Participacao dos Lucros

**Saidas:** CONTABIL, MARKETING, PRO-LABORE, FOLHA, OUTROS, IMPOSTO

## 7. Filtros Globais (Power BI-like)

Todos os filtros alteram TODOS os visuais simultaneamente:

| Filtro | Opcoes | Default |
|---|---|---|
| Ano | Todos os anos com dados (2023-2026+) | Ano mais recente com dados |
| Mes | Todos ou mes especifico | Todos |
| Categoria | Todas ou categoria especifica | Todas |
| Tipo | Todos, Somente Entradas, Somente Saidas | Todos |
| Status | Todos, Somente Realizados, Somente Pendentes | Todos |

### Comportamento dos filtros
- Trocar o ano reseta o filtro de mes para "Todos"
- Filtros sao combinados (AND): ano E mes E categoria E tipo E status
- KPIs, graficos, tabela e contadores respondem aos filtros
- Botao "Limpar" remove todos exceto o ano

## 8. KPIs do Dashboard

| KPI | Calculo | Responde a filtros? |
|---|---|---|
| Saldo em Contas | Soma dos saldos bancarios | NAO (posicao atual, independente de filtros) |
| Entradas | Soma de valorRecebido onde movimento = Entrada | SIM |
| Saidas | Soma de valorRecebido onde movimento = Saida | SIM |
| Resultado | Entradas - Saidas | SIM |

## 9. Atualizacao

| Tipo | Frequencia | Mecanismo |
|---|---|---|
| Automatica | 1x ao dia | ISR Next.js (revalidate: 86400) |
| Manual | Sob demanda | Botao "Atualizar agora" (POST /api/refresh) |
| Deploy | A cada push | Vercel auto-deploy via GitHub |

### Fuso horario
- Servidor Vercel roda em UTC
- Todas as datas/horas exibidas sao convertidas para `America/Sao_Paulo` (UTC-3)

## 10. Telas do Dashboard

| Rota | Funcao |
|---|---|
| `/` | Dashboard principal com KPIs, grafico barras, pizza categorias, saldos, tabela |
| `/movimentacoes` | Tabela completa dedicada com busca e filtros |
| `/mensal` | Grid de cards por mes (clicavel para drill-down) |
| `/mensal/[slug]` | Drill-down: KPIs, categorias e tabela filtrada do mes |
| `/contas` | Saldos bancarios detalhados, participacao, ultimas movimentacoes |

## 11. Seguranca

- Planilha publica (link sharing ativo)
- Sem autenticacao no dashboard (acesso livre pela URL)
- Dados financeiros sensiveis: URL nao indexada, sem SEO
- Deploy no Vercel com HTTPS

## 12. Stack Tecnica

| Componente | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS 4, Lucide Icons |
| Graficos | Recharts |
| CSV parsing | PapaParse |
| Deploy | Vercel (auto-deploy via GitHub) |
| Repositorio | github.com/oericmarques/dash-finance-lille |
