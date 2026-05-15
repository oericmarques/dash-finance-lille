# Regras de Negocio - Lille Finance Dashboard

> Documento para validacao KPI por KPI. Revisar com o Eric antes de considerar final.

## 1. Fonte de Dados

| Item | Detalhe |
|---|---|
| Origem | Google Sheets (planilha publica) |
| ID da planilha | `1476Ok5dUg6XZgwBiL2Om1I3WHzxSkVq6LEtabyMOy_w` |
| Metodo de acesso | CSV via endpoint `gviz/tq` (sem autenticacao) |
| Frequencia de sync | 1x ao dia (revalidate 86400s) + botao manual |

### Abas utilizadas

| Aba | Funcao |
|---|---|
| `Plano_Contas` | Classificacao: ID comeca com RB = Entrada, PG = Saida |
| `fMovimentacoes` | Fonte principal. Todas as transacoes |
| `Saldo Banco` | Posicao das contas bancarias |

### Colunas de fMovimentacoes

| Index | Coluna | Uso |
|---|---|---|
| 0 | plano_contas_ID | Cruzamento com Plano_Contas para saber se e Entrada ou Saida |
| 1 | data | Data de VENCIMENTO (quando deveria ser pago/recebido) |
| 2 | cliente | Nome do cliente ou fornecedor |
| 3 | uf | Estado (pouco preenchido) |
| 4 | descricao | Descricao da movimentacao |
| 5 | valor_recebido | Valor em BRL (formato: 4.000,00) |
| 6 | data_pgto | Data de PAGAMENTO efetivo (quando FOI pago/recebido) |
| 7 | Nota Fiscal | Numero da NF |
| 8 | categoria | Categoria da movimentacao |
| 9 | MES | Mes de competencia (formato: mai.26) |
| 10 | PAG | Forma de pagamento |
| 11 | Plano de Contas | Referencia contabil |

## 2. Sistema de 3 Status (REGRA CRITICA)

| Condicao | Status | Cor | Significado |
|---|---|---|---|
| `data_pgto` preenchida | **pago** | Verde (#16a34a) | Ja foi pago ou recebido |
| `data_pgto` vazia E `data` >= hoje | **a_vencer** | Azul (#3b82f6) ou Laranja (#f97316) | Compromisso futuro (ainda no prazo) |
| `data_pgto` vazia E `data` < hoje | **vencido** | Vermelho (#dc2626) | Em atraso (passou do vencimento sem pagamento) |

### Logica no codigo (sheets.ts)
```
SE data_pgto preenchida → pago
SE data_pgto vazia E sem data_vencimento → a_vencer
SE data_pgto vazia E data_vencimento < hoje → vencido
SE data_pgto vazia E data_vencimento >= hoje → a_vencer
```

### Nomenclatura por pagina

| Status | Contas a Receber | Contas a Pagar |
|---|---|---|
| pago | Recebido | Pago |
| a_vencer | A Receber | A Vencer |
| vencido | Inadimplente | Vencido |

## 3. Estrutura de Paginas

### Pagina 1: FLUXO DE CAIXA (`/`)

Visao geral: Entradas vs Saidas consolidadas.

| KPI | Calculo | Fonte |
|---|---|---|
| Despesas | Soma de `valor_recebido` onde movimento = Saida (TODOS os status) | soSaidas → totalPorStatus → .total |
| Receita | Soma de `valor_recebido` onde movimento = Entrada E status = pago | soEntradas → totalPorStatus → .pago |
| A receber | Soma de `valor_recebido` onde movimento = Entrada E status = a_vencer OU vencido | soEntradas → totalPorStatus → .aVencer + .vencido |
| Saldo | Receita total (Entrada.total) - Despesa total (Saida.total) | totEnt.total - totSai.total |

**DUVIDA PARA VALIDAR:** O KPI "Despesas" soma TODOS os status (pago + a_vencer + vencido) ou so o que foi pago? Atualmente soma tudo.

**DUVIDA PARA VALIDAR:** O KPI "Receita" mostra so o recebido (pago) ou o total (pago + a_receber + inadimplente)?

Graficos:
- Receitas por mes (barras empilhadas: Recebido / A Receber / Inadimplente)
- Despesas por mes (barras empilhadas: Pago / A Vencer / Vencido)
- Donut: Receitas vs Despesas (total geral)
- Donut: Categorias de despesa (top 6)
- Saldo mensal (barra: receita.total - saida.total de cada mes)

### Pagina 2: CONTAS A RECEBER (`/contas-a-receber`)

Filtra SOMENTE movimentacoes com movimento = Entrada.

| KPI | Calculo | Fonte |
|---|---|---|
| Recebido | Soma de Entradas com status = pago | totalPorStatus(entradas).pago |
| A Receber | Soma de Entradas com status = a_vencer | totalPorStatus(entradas).aVencer |
| Inadimplentes | Soma de Entradas com status = vencido | totalPorStatus(entradas).vencido |
| % Inadimplencia | (vencido / total) * 100 | Percentual sobre o total de entradas |

Graficos:
- Receitas por mes (barras empilhadas por status)
- Donut: Status dos recebimentos (pago / a_receber / inadimplente)
- Donut: Categorias de receita (top 6)
- Tabela de clientes (top 12 por volume total)
- Ranking: Maiores inadimplentes

### Pagina 3: CONTAS A PAGAR (`/contas-a-pagar`)

Filtra SOMENTE movimentacoes com movimento = Saida.

| KPI | Calculo | Fonte |
|---|---|---|
| Pago | Soma de Saidas com status = pago | totalPorStatus(saidas).pago |
| A Vencer | Soma de Saidas com status = a_vencer | totalPorStatus(saidas).aVencer |
| Vencidos | Soma de Saidas com status = vencido | totalPorStatus(saidas).vencido |
| % Vencido | (vencido / total) * 100 | Percentual sobre o total de saidas |

Graficos:
- Despesas por mes (barras empilhadas por status)
- Donut: Status dos pagamentos (pago / a_vencer / vencido)
- Donut: Categorias de despesa (top 6)
- Tabela de fornecedores (top 12 por volume total)
- Ranking: Maiores credores (pendente + vencido)

## 4. Filtros

| Filtro | Tipo | Default | Comportamento |
|---|---|---|---|
| Ano | Dropdown | Ano corrente (2026) | Trocar ano reseta meses |
| Mes | Chips horizontais (multi-select) | Mes corrente (ex: Mai) | Vazio = todos. Clicar seleciona/deseleciona |

### Regras dos filtros
- Todos os visuais (KPIs, graficos, tabelas, rankings) reagem aos filtros
- Filtro de mes usa o campo `MES` (competencia), NAO a data de vencimento
- Combinar filtros: ano E mes (AND)
- Botao "Limpar" volta para todos os meses do ano

**DUVIDA PARA VALIDAR:** Quando filtra "Mai 2026", um titulo vencido de Abril que nao foi pago deve aparecer? Atualmente NAO aparece, pq o MES de competencia e abril, nao maio. Se quiser ver inadimplencia acumulada, precisaria de outra logica.

## 5. Contas Bancarias

| Banco | Saldo atual |
|---|---|
| BANCO C6 | R$ 38.924,14 |
| BANCO CONTA GLOBAL | R$ 3.676,16 |
| ASAAS | R$ 0,00 |
| INVESTIMENTO | R$ 53.316,76 |

- Saldo total consolidado mostrado no KPI "Saldo" da pagina Fluxo de Caixa
- Saldos NAO sao afetados pelos filtros (posicao atual, independente de periodo)

## 6. Classificacao de Movimentacoes (Plano de Contas)

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

## 7. Categorias

**Entradas:** Consultoria, Projetos e Consultoria, Cursos, Marketing, Participacao dos Lucros

**Saidas:** CONTABIL, MARKETING, PRO-LABORE, FOLHA, OUTROS, IMPOSTO

## 8. Atualizacao e Fuso

| Tipo | Frequencia | Mecanismo |
|---|---|---|
| Automatica | 1x ao dia | ISR Next.js (revalidate: 86400) |
| Manual | Sob demanda | Botao "Atualizar" no header |
| Deploy | A cada push | Vercel auto-deploy via GitHub |

- Todas as datas/horas exibidas em `America/Sao_Paulo` (UTC-3)

## 9. Seguranca

- Planilha publica (qualquer pessoa com o link)
- Dashboard sem autenticacao (acesso livre pela URL)
- Dados financeiros sensiveis
- HTTPS via Vercel

## 10. Stack

| Componente | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | Tailwind CSS 4, Lucide Icons |
| Graficos | Recharts |
| CSV parsing | PapaParse |
| Deploy | Vercel (auto-deploy via GitHub) |
| Repositorio | github.com/oericmarques/dash-finance-lille |

## 11. Pontos para validacao com Eric

- [ ] KPI "Despesas" no Fluxo de Caixa: soma TODOS status ou so o que foi pago?
- [ ] KPI "Receita" no Fluxo de Caixa: so recebido (pago) ou total?
- [ ] Inadimplencia: filtrar por mes de competencia ou acumular tudo que esta vencido ate o mes?
- [ ] Saldo mensal: (entradas_pago - saidas_pago) ou (entradas_total - saidas_total)?
- [ ] Tabela de clientes/fornecedores: top 12 e suficiente ou precisa de scroll/paginacao?
- [ ] Ranking: top 8 e suficiente?
- [ ] Adicionar pagina separada para saldos bancarios detalhados?
- [ ] Adicionar autenticacao (login) para proteger os dados?
