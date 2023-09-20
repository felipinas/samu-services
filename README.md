# Samu services

Assume-se que rabbitmq eatá rodando em localhost, porta 5672  
`docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management`
___
A fonte de dados em [fonte.js](https://github.com/felipinas/samu-services/blob/main/backend/fonte.js). deve apontar para um arquivo contendo os dados de [Dados Recife - SAMU](http://dados.recife.pe.gov.br/dataset/servico-de-atendimento-movel-de-urgencia-samu-2023/resource/548a12cf-a382-409c-bf68-21db251199b4)
