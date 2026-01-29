# index_management:
http://localhost:3040/app/opensearch_index_management_dashboards#/indices?from=0&search=&showDataStreams=false&size=20&sortDirection=desc&sortField=index

Nesta tela terá uma lista de index de logs que ja chegaram ao opensearch (clicar em refresh se necessário)
Observer que o nome do index sempre comeca com 'Log_' e termina com o dia de criacao (ex: _2026_01_12), 
isso eh assim para permitir  a rotina de clean que elimina logs de mais de 7 dias.


# indexPatterns:
http://localhost:3040/app/management/opensearch-dashboards/indexPatterns/

Nesta tela:
1-  clicar em 'Create index pattern',
No campo 'Index pattern name' digitar o nome do index desejado (na pagina de antes) (digitar algo como 'Log_nome-index*, para buscar os indexes de todas as datas')
Apos clicar em 'Next' selecionar o campo 'Time field' para o index.

2- sempre que necessario "atualizar os campos do log", clicar no nome do index desejado
Isso vai abrir os detalhes do index, onde se pode visualizar todos os campos ja mapeados
No canto superior direito, tem um botao 'Refresh field list', que se clicado atualiza essa lista com possiveis novos campos recebidos

# 'reset' do index
Para "limpar o index e recriar, eh necessario apagar na pagina de 'indexPatterns' 
Na pagina de 'indexPatterns', pode-se apagar ou clicar em 'refresh'
Depois de receber novos logs, repetir o procedimento para criar novamente o que foi apagado
