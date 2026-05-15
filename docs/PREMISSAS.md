# Premissas - Lille Finance Dashboard

## Premissas de Dados

1. **Fonte unica de verdade**: A aba `fMovimentacoes` e a unica fonte de dados para calculos. A aba `Pagamentos` foi desconsiderada por ter dados incompletos/desatualizados.

2. **Plano de Contas estavel**: Os IDs (RB11, PG31 etc) e suas classificacoes nao mudam com frequencia. Se um novo ID for adicionado na planilha, o dashboard precisa que ele tambem exista na aba Plano_Contas.

3. **Formato de moeda BRL**: Todos os valores estao em Reais (R$), formatados com ponto como separador de milhar e virgula como decimal (ex: `34.950,00`).

4. **Formato de data DD/MM/AAAA**: Datas na planilha seguem o padrao brasileiro.

5. **Coluna MES sempre preenchida**: O agrupamento mensal depende da coluna MES (formato `mmm.aa`). Linhas sem MES sao ignoradas nos calculos mensais.

6. **Dados futuros sao validos**: Movimentacoes com data futura representam compromissos (a pagar/receber). O campo `data_pgto` vazio indica que ainda nao foi efetivado.

7. **Saldos bancarios sao manuais**: A aba `Saldo Banco` e atualizada manualmente na planilha. O dashboard so le esses valores.

## Premissas de Acesso

1. **Planilha publica**: A planilha permanece com compartilhamento "qualquer pessoa com o link pode ver".

2. **Sem autenticacao**: O dashboard nao tem login. Qualquer pessoa com a URL acessa.

3. **Dois usuarios**: Eric + 1 pessoa acessam o dashboard.

## Premissas de Atualizacao

1. **Dados mudam na planilha**: As alteracoes sao feitas diretamente no Google Sheets, nao pelo dashboard.

2. **Dashboard e somente leitura**: Nenhuma operacao de escrita na planilha.

3. **Cache de 24h aceitavel**: Os dados nao mudam com alta frequencia. Atualizacao diaria + botao manual e suficiente.

## Premissas de Calculo

1. **Resultado = Entradas - Saidas**: Calculo simples, sem considerar impostos adicionais ou ajustes contabeis.

2. **Categorias vem da planilha**: O dashboard nao cria ou modifica categorias. Usa exatamente o que esta na coluna `categoria`.

3. **Ordenacao de meses**: Baseada no formato `mmm.aa` convertido para numero (ano * 100 + mes). jan.23 = 2301, dez.26 = 2612.

## Limitacoes Conhecidas

1. **Sem historico de saldos**: O dashboard mostra apenas o saldo ATUAL de cada conta, nao a evolucao ao longo do tempo.

2. **Sem conciliacao bancaria**: Nao ha cruzamento entre movimentacoes e extratos bancarios.

3. **Sem multi-moeda**: Apenas BRL.

4. **Sem controle de acesso**: Qualquer pessoa com a URL ve todos os dados.

5. **Dependencia do Google Sheets**: Se a planilha ficar offline ou mudar de ID, o dashboard para de funcionar.
